# 如何在我們的智能合約中使用 ERC-4626
## reference:
- [How to Use ERC-4626 with Your Smart Contract](https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-use-erc-4626-with-your-smart-contract/)
## 構建 ERC-4626 金庫
現在我們對 ERC-4626 標準和產生收益的保險庫有了基本的了解，讓我們應用我們的知識並構建一個適用於兩者的智能合約。打開使用 foundry init 〈dir〉並創建一個名為TokenVault.sol的新文件，我們的保險庫智能合約將存放在該文件中。完整的代碼將在本節的底部，但首先讓我們簡要回顧一下代碼。

構建我們的保險庫的第一步是確定我們的許可證標識符、Solidity 編譯版本，然後導入 ERC-4626 庫。
```solidity=
//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "https://github.com/Rari-Capital/solmate/blob/main/src/mixins/ERC4626.sol";
```
導入 ERC-4626 庫後，下一步是為您的合約指定一個名稱並使用“is”關鍵字繼承該庫。

```solidity=
//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "https://github.com/Rari-Capital/solmate/blob/main/src/mixins/ERC4626.sol";

contract TokenVault is ERC4626 {

}
```
下一步是創建一個映射，在用戶存款後跟踪他們在金庫中的份額。該映射將維護每個用戶的份額餘額的記錄。

```solidity=
// a mapping that checks if a user has deposited the token
mapping(address => uint256) public shareHolder;
```
接下來，創建一個構造函數，為 ERC-4626 構造函數賦值：_asset用於 ERC20 代幣地址，_name用於金庫代幣的名稱，_symbol用於金庫代幣的符號。例如，如果您存入 USDC，您可以使用“vaultUSDC”作為_name ，使用“vUSDC”作為_symbol。
```solidity=
constructor(ERC20 _asset, string memory _name, string memory _symbol) ERC4626 (_asset, _name, _symbol){}
```
您可能想知道為什麼我們只分配這些特定參數。原因是這些參數是 ERC-4626 保險庫標準的構造函數所需要的。這是接受這些參數的 ERC-4626 庫構造函數。
```solidity=
// ERC-4626 LIBRARY
constructor(
        ERC20 _asset,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol, _asset.decimals()) {
        asset = _asset;
}
```
現在，我們將創建一個函數_deposit，允許用戶將資產代幣存入金庫。金庫的功能應使用戶能夠存入代幣並以“股份”的形式接收存款證明。這些份額代表用戶對存入代幣的所有權，並允許他們在選擇時從保險庫中提取代幣。
```solidity=
/**
 * @notice function to deposit assets and receive vault token in exchange
 * @param _assets amount of the asset token
 */
function _deposit(uint _assets) public {
    // checks that the deposited amount is greater than zero.
    require(_assets > 0, "Deposit less than Zero");
    // calling the deposit function ERC-4626 library to perform all the functionality
    deposit(_assets, msg.sender);
    // Increase the share of the user
    shareHolder[msg.sender] += _assets;
}
```
首先，我們檢查 的值_assets以確保它大於零。然後，我們利用ERC-4626 庫中的存款功能。此函數處理與接收資產代幣、為用戶創建保險庫代幣以及發出存款事件相關的所有邏輯。例如，如果用戶存入 100 美元，他們將收到 100 vUSD（保險庫美元）作為存款證明。最後，我們使用shareHolder映射增加用戶的共享值。這是執行所有這些功能的 ERC-4626 庫中的存款功能。
```solidity=
// ERC-4626 LIBRARY
function deposit(uint256 assets, address receiver) public virtual returns (uint256 shares) {
        // Check for rounding errors, as we round down in previewDeposit.
        require((shares = previewDeposit(assets)) != 0, "ZERO_SHARES");

        // Need to transfer before minting or ERC777s could reenter.
        asset.safeTransferFrom(msg.sender, address(this), assets);

        _mint(receiver, shares);

        emit Deposit(msg.sender, receiver, assets, shares);

        afterDeposit(assets, shares);
}
```
創建 \_deposit 函數後，現在讓我們創建一個 getter 函數來查看存放在這個金庫中的資產總量。我們將覆蓋 ERC-4626 庫中現有的 totalAssets 函數，並添加自定義邏輯以根據資產代幣檢索保險庫的餘額。
```solidity=
// returns total number of assets
function totalAssets() public view override returns (uint256) {
    return asset.balanceOf(address(this));
}
```
現在，讓我們實現_withdraw函數，以便用戶可以贖回其原始數量的資產代幣，以及這些資產代幣產生的收益，以換取股票或金庫代幣。
```solidity=
/**
 * @notice Function to allow msg.sender to withdraw their deposit plus accrued interest
 * @param _shares amount of shares the user wants to convert
 * @param _receiver address of the user who will receive the assets
 */
function _withdraw(uint _shares, address _receiver) public {
    // checks that the deposited amount is greater than zero.
    require(_shares > 0, "withdraw must be greater than Zero");
    // Checks that the _receiver address is not zero.
    require(_receiver != address(0), "Zero Address");
    // checks that the caller is a shareholder
    require(shareHolder[msg.sender] > 0, "Not a shareHolder");
    // checks that the caller has more shares than they are trying to withdraw.
    require(shareHolder[msg.sender] >= _shares, "Not enough shares");
    // Calculate 10% yield on the withdraw amount
    uint256 percent = (10 * _shares) / 100;
    // Calculate the total asset amount as the sum of the share amount plus 10% of the share amount.
    uint256 assets = _shares + percent;
    // calling the redeem function from the ERC-4626 library to perform all the necessary functionality
    redeem(assets, _receiver, msg.sender);
    // Decrease the share of the user
    shareHolder[msg.sender] -= _shares;
}
```
在上面的代碼塊中，我們首先取兩個參數：*shares,* 是用戶想要贖回的股份數量，以及 _receiver ，這是將接收資產代幣的用戶地址。我們進行了幾項檢查：_shares必須大於零，_receiver 地址不能為零，調用者必須是股東，並且他們必須擁有等於或大於他們贖回的股份數量。

一旦滿足這些條件，我們將計算產生的收益並將其添加到原始資產中_shares以確定將收到的資產代幣總量_receiver。接下來，我們使用ERC-4626的贖回功能，將共享代幣進行銷毀，並將資產代幣轉移到_receiver的賬戶中。最後，我們更新調用者的shareHolder值。

下面是 ERC-4626 庫中的 redeem 函數，它執行所有這些兌換功能：
```solidity=
function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public virtual returns (uint256 assets) {
        if (msg.sender != owner) {
            uint256 allowed = allowance[owner][msg.sender]; // Saves gas for limited approvals.

            if (allowed != type(uint256).max) allowance[owner][msg.sender] = allowed - shares;
        }

        // Check for rounding error since we round down in previewRedeem.
        require((assets = previewRedeem(shares)) != 0, "ZERO_ASSETS");

        beforeWithdraw(assets, shares);

        _burn(owner, shares);

        emit Withdraw(msg.sender, receiver, owner, assets, shares);

        asset.safeTransfer(receiver, assets);
}
```
我們還將創建totalAssetsOfUser函數，通過將地址作為參數來檢查用戶資產代幣的餘額。
```solidity=
// returns total balance of user
function totalAssetsOfUser(address _user) public view returns (uint256) {
    return asset.balanceOf(_user);
}

這是完整的 VaultToken 智能合約：

//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "https://github.com/Rari-Capital/solmate/blob/main/src/mixins/ERC4626.sol";

contract TokenVault is ERC4626 {
    // a mapping that checks if a user has deposited the token
    mapping(address => uint256) public shareHolder;

    constructor(
        ERC20 _asset,
        string memory _name,
        string memory _symbol
    ) ERC4626(_asset, _name, _symbol) {}

    /**
     * @notice function to deposit assets and receive vault tokens in exchange
     * @param _assets amount of the asset token
     */
    function _deposit(uint _assets) public {
        // checks that the deposited amount is greater than zero.
        require(_assets > 0, "Deposit less than Zero");
        // calling the deposit function from the ERC-4626 library to perform all the necessary functionality
        deposit(_assets, msg.sender);
        // Increase the share of the user
        shareHolder[msg.sender] += _assets;
    }

    /**
     * @notice Function to allow msg.sender to withdraw their deposit plus accrued interest
     * @param _shares amount of shares the user wants to convert
     * @param _receiver address of the user who will receive the assets
     */
    function _withdraw(uint _shares, address _receiver) public {
        // checks that the deposited amount is greater than zero.
        require(_shares > 0, "withdraw must be greater than Zero");
        // Checks that the _receiver address is not zero.
        require(_receiver != address(0), "Zero Address");
        // checks that the caller is a shareholder
        require(shareHolder[msg.sender] > 0, "Not a share holder");
        // checks that the caller has more shares than they are trying to withdraw.
        require(shareHolder[msg.sender] >= _shares, "Not enough shares");
        // Calculate 10% yield on the withdrawal amount
        uint256 percent = (10 * _shares) / 100;
        // Calculate the total asset amount as the sum of the share amount plus 10% of the share amount.
        uint256 assets = _shares + percent;
        // calling the redeem function from the ERC-4626 library to perform all the necessary functionality
        redeem(assets, _receiver, msg.sender);
        // Decrease the share of the user
        shareHolder[msg.sender] -= _shares;
    }

    // returns total number of assets
    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    // returns total balance of user
    function totalAssetsOfUser(address _user) public view returns (uint256) {
        return asset.balanceOf(_user);
    }
}
```

就是這樣！您已經創建了使用 ERC-4626 代幣化保險庫標準產生收益的保險庫智能合約。

## 部署 Vault 智能合約
現在，讓我們部署我們的保險庫智能合約。然而，在此之前，我們需要創建一個 ERC-20 智能合約作為資產代幣。

這是資產代幣的智能合約：
```solidity!
// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor() ERC20("USDC", "USDC") {}

    function mint(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}
```


首先創建一個名為 的文件USDC.sol，然後粘貼上面顯示的資產令牌智能合約代碼。

...



