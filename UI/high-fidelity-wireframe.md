# High-fidelity Wireframe

##什麼是High-fidelity Wireframe
High-fidelity Wireframe(Mockup)，適用於產品設計後期，與開發人員溝通設計的視覺元素及互動。此階段著重於 UI 及 Motion 設計，因此通常會在 Low-fidelity Wireframe的階段確定好產品功能及流程後才會開始進行，盡可能地去呈現最終產品的樣貌。

## 產出工具

目前團隊使用工具為： Figma、Illustrator、After Effect、[LottieFiles](https://lottiefiles.com)

Figma 為主要協作軟體，也是最終交付予開發人員的形式，而Illustrator 則是用來產出較複雜的向量圖，並且可直接將向量圖轉移到Figma當中，方便工程師下載svg檔。

After Effect 及 LottieFiles 則是在處理產品當中的動畫，透過插件可將After Effect中設計好的動畫轉為 Lottie 動畫，或是直接在 LottieFiles中尋找合適的動畫套用。

## 產出流程

1. Design System

Design System 是產品視覺設計的基底，所有的Components及Module 都應依照 Design System的規則來設計，Design System的詳細介紹請見 [KM-Design System](https://github.com/CAFECA-IO/KnowledgeManagement/blob/master/UI/design-system-by-jodie.md)

2. Module 建立

從之前的 Lo-Fi Wireframe當中去統整會重複出現的元素來建立Module，例如 Header, Footer 等，每個產品都會有不同的Module組合。 在開始主要設計稿製作之前，會需要將Module建立起來，而這些Module大部分也都是從 Design System 當中的Basic Component去組合而成的，而最後不同的Module會再組合成一個完整的頁面。
![Atomic Design: Building Better Digital Products Piece by Piece](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/ca4ac3c2-03f3-4df0-828d-911bc1aa8b7a)

3. Page 建立

正式進入主要設計稿的環節，也就是建立每個 Page，而這些 Page 就是從我們先前建立好的Module及Component組合而成的，當然也必須謹遵Design System中的規則。
在此階段也會加入Interaction，讓最後的Prototype能夠盡可能地接近使用者實際與產品互動的狀況，同時也是讓開發者更清楚每個元素的互動方式。

## 原子設計

目前團隊建立Hi-Fi Wireframe所使用的方式稱為原子設計，從Design System 開始定義出 Design Token 及 Component，再一步一步層層疊加成最終產品的樣貌。
此方式是為了確保產品的：

1. 一致性
在介面設計中，一致性是非常重要的規則之一，必須確保產品中的每一項元素儘管在不同的介面中轉跳也會保有一致性，如此一來才能避免使用者的認知負擔，同時也能加強使用者對品牌的印象，儘管在沒有多餘解釋的情況下，使用者都能知道自己在使用相同的產品，甚至是不同產品但使用者可以知道其來自於同品牌。

2. 重複利用性
不論是在設計及開發中，這樣的特性都能大幅提升效率，例如定義出Design Token 及 Basic Component，可以讓設計師及開發人員直接從Library 中提取元素進行組合排列，無需每次都從頭來過，這樣不僅減少了製作時間，也確保了團隊間是以相同的元素為基礎進行開發。

3. 可擴充性
在有了定義好的基本元素下，設計師可以輕鬆的用基本元素拼湊以符合未來新功能或新產品的需求，也可以確保在產出新功能時，仍能保有與原本產品的一致性。

4. 效率
以結構性的方法進行設計，可以大幅簡化未來無論在維護、修改、創新等過程，在設計端及開發端中都是如此，透過小的元素組合排列成最終產品，或是修改元素值可以直接套用在所有產品上，無需再一個一個的調整或修改。

5. 協作性
如此的設計方法可以大幅提升團隊的協作性，無論是在設計師與設計師之間，亦或者設計師與開發人員之間，像是整個團隊都翻閱著同一本字典，縮短了團隊間的溝通距離。



# Reference
[Atomic Design: Building Better Digital Products Piece by Piece](https://bootcamp.uxdesign.cc/atomic-design-building-better-digital-products-piece-by-piece-8cd9eee04f44)



