<h1> Bringing the design and development world closer than ever before </h1>

![3d-illustration-figma-graphic-design-web-design-black-white-black-background](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/19e433c1-7c13-4784-bc78-48a0ed307079)

<h2> 1. Auto-Layout </h2>
<img width="236" alt="截圖 2023-07-25 下午2 34 21" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/54a48897-405b-440b-8a23-cd560ee81223">

Before, we could only use auto layout in horizontal or vertical orientations. However, with the new update, now we can automatically wrap content when the witdth of the viewport is below a specific measurement.

<img width="235" alt="截圖 2023-07-25 下午2 39 45" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/b220272e-140f-4bdd-aa04-b0b9b9228edc">

We also have the option to set the minimum or maximum width for containers in figma. Once the container reaches the minimum width, it will automatically start wrapping the content.

![wrap_1](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/a862ccf8-ea1b-4abd-86fc-a3fa1e87f184)


Indeed, with the new features available, we can now truly create responsive designs. We have access to wrap auto layout, as well as the ability to set both minimum and maximum width or height for containers, making it easier to design and adapt to different viewport sizes.

<br>

<h2> 2. Variables </h2>
Variables is a very powerful tool to systematize your design.
<br>
<br>

<b> - Types of variables </b>

There are four types of variables. Each one can be applied to specific properties and elements.

<table style="height: 66px; width: 522px;">
<thead>
<tr style="height: 22px;">
<th style="height: 22px; width: 121.812px;">Variable type</th>
<th style="height: 22px; width: 133.375px;">Defined by</th>
<th style="height: 22px; width: 256.812px;">Can be applied to</th>
</tr>
</thead>
<tbody>
<tr style="height: 22px;">
<td style="height: 22px; width: 113.812px;"><span class="ui-icon-no-border variable-color" aria-label="color variable type, color paint palette"></span> Color</td>
<td style="height: 22px; width: 125.375px;">Solid fills</td>
<td style="height: 22px; width: 248.812px;">
<ul>
<li>Fill colors</li>
<li>Stroke colors</li>
</ul>
</td>
</tr>
<tr style="height: 22px;">
<td style="height: 22px; width: 113.812px;"><span class="ui-icon-no-border variable-number" aria-label="number variable type, pound, hashtag"></span> Number</td>
<td style="height: 22px; width: 125.375px;">Number values</td>
<td style="height: 22px; width: 248.812px;">
<ul>
<li>Text layers</li>
<li>Corner radius</li>
<li>Minimum and maximum width/height</li>
<li>Padding and gap between</li>
</ul>
</td>
</tr>
<tr>
<td style="width: 113.812px;"><span class="ui-icon-no-border variable-string" aria-label="string variable type, text"></span> String</td>
<td style="width: 125.375px;">
<p>Text strings and variant names</p>
</td>
<td style="width: 248.812px;">
<ul>
<li>Text layers</li>
<li>Variant instances</li>
</ul>
</td>
</tr>
<tr>
<td style="width: 113.812px;"><span class="ui-icon-no-border variable-boolean" aria-label="boolean variable type, circle inside square"></span> Boolean</td>
<td style="width: 125.375px;">
<p>True/false values</p>
</td>
<td style="width: 248.812px;">
<ul>
<li>Layer visibility</li>
<li>Variant instances with true/false values</li>
</ul>
</td>
</tr>
</tbody>
</table>

<br><b> - Manage variables </b>
<br>

It's more flexible and convenient when you create your design system with variables insteand of style.
<br>For example:
![HC_variables-explain_GIF_2 5](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/9a4ff298-031c-4e98-b9de-35cd96c1bfd6)
(Photo by Figma)<br>
<br>
If we only want some tokens to change, this structure allows us to choose the correct token upstream and change it without having to manually rework everything downstream.

<br><b> - Modes variables </b>
<br>

Variables also allow you to set different modes for your design, such as dark and light mode, or for different devices.
So that you can manage the color, spacing, radius, or other value in different modes.
<img width="960" alt="variable-default-mode" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/ea13df13-f4b9-463e-a361-f7d1e42c0558">
(Photo by Figma)<br>
<br>

<h2> 3. Advanced prototyping </h2>

New features:

<b>Set variables</b>
<br><b>Conditional</b>

Previous we talked about that variables essentially allow you to store information in your designs and they are actually what power the  advanced prototyping.
By using the prototyping interaction to make changes to those variables and by binding elements of your designs to variables, you're able to create prototypes that have logic and are able to create screens that are dynamically update based on your variables.

For example

<h3>- Set variables</h3>

Step 1: Set a number variable named 'LikeCount' with an initial value of 0.
<br><img width="849" alt="截圖 2023-07-26 下午4 16 06" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/02e8695e-9b83-4ed3-973e-c79d85d222d7">
<br>
<br>
Step 2: Binding the variable to the number next to the like button
<br>![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/60fd60f7-3be9-4cc5-b7f7-945ee1034406)

<br>
<br>
Step 3: Select the button and add interaction - on click - Set variable and add a simple logic by entering <b> #LikeCount +1</b>
<br><img width="100%" alt="截圖 2023-07-26 下午4 16 06" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/7b7e006a-e3ae-48ee-b877-aad584cf4493">


<br>
<br>So now when the user click on the like button, the number will increase by 1
<br>
<br>
<br>
<h3>- Conditional</h3>

Step 1: Set a number variable named 'itemCount' with an initial value of 0.
<br><img width="353" alt="截圖 2023-07-26 下午3 32 50" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/3278adbd-f879-41dd-a30c-46951b3213f5">
<br>
<br>
Step 2: Select the button and add interaction - on click - Conditional
<br>![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/905d340a-9b52-44e2-8f91-73f85525be5b)
<br>
<br>Step 3: Now you can  apply a simple logic to the button by entering 
<br><b>if #itemCount >0 set variable #itemCount = #itemCount -1</b>
<br><b>else #itemCount >0 set variable #itemCount = 0</b>

<br>This logic ensures that when users click on the '-' button, the number will automatically decrease by 1. However, we want to prevent the number from going below 0. So, the 'else' condition ensures that if the current #itemCount is greater than 0, it will decrement by 1; otherwise, it will be set to 0. With this condition, #itemCount will never be negative.

<hr>
<h3>References</h3>
[Mizko- Figma's CONFIG 2023 Updates Explained | Real Examples](https://www.youtube.com/watch?v=jBXy30VwC_U&t=1097s)
<br>[Figma Learn](https://help.figma.com/hc/en-us)
<br>[DesignCoure- Figma Variables & Advanced Prototyping - Crash Course]([https://help.figma.com/hc/en-us](https://www.youtube.com/watch?v=Tx45NcbU6aA)https://www.youtube.com/watch?v=Tx45NcbU6aA)

