# Bringing the Design and Development World Closer Than Ever Before

![3D Illustration](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/19e433c1-7c13-4784-bc78-48a0ed307079)

## 1. Auto-Layout

Before, we could only use auto layout in horizontal or vertical orientations. However, with the new update, now we can automatically wrap content when the width of the viewport is below a specific measurement.

![Auto-Layout 1](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/54a48897-405b-440b-8a23-cd560ee81223)

We also have the option to set the minimum or maximum width for containers in Figma. Once the container reaches the minimum width, it will automatically start wrapping the content.

![Auto-Layout 2](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/b220272e-140f-4bdd-aa04-b0b9b9228edc)

Indeed, with the new features available, we can now truly create responsive designs. We have access to wrap auto layout, as well as the ability to set both minimum and maximum width or height for containers, making it easier to design and adapt to different viewport sizes.

## 2. Variables

Variables are a very powerful tool to systematize your design.

### Types of Variables

| Variable Type | Defined By | Can Be Applied To           |
|---------------|------------|-----------------------------|
| Color         | Solid Fills| Fill Colors, Stroke Colors  |
| Number        | Number Values | Text Layers, Corner Radius, Minimum and maximum width/height, Padding and gap between |
| String        | Text Strings and Variant Names | Text Layers, Variant Instances |
| Boolean       | True/False Values | Layer visibility, Variant instances with true/false values |

#### Manage Variables

It's more flexible and convenient when you create your design system with variables instead of styles. For example:

![Variables Example](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/9a4ff298-031c-4e98-b9de-35cd96c1bfd6)

<sub>Image Credit: Figma</sub>

If we only want some tokens to change, this structure allows us to choose the correct token upstream and change it without having to manually rework everything downstream.

#### Modes Variables

Variables also allow you to set different modes for your design, such as dark and light mode, or for different devices. So that you can manage the color, spacing, radius, or other value in different modes.

![Modes Variables Example](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/ea13df13-f4b9-463e-a361-f7d1e42c0558)

<sub>Image Credit: Figma</sub>

## 3. Advanced Prototyping

New features:

- Set variables
- Conditional

Previously, we talked about that variables essentially allow you to store information in your designs and they are actually what power the advanced prototyping. By using the prototyping interaction to make changes to those variables and by binding elements of your designs to variables, you're able to create prototypes that have logic and are able to create screens that are dynamically updated based on your variables.

### Set Variables

Step 1: Set a number variable named 'LikeCount' with an initial value of 0.

![Set Variables Step 1](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/02e8695e-9b83-4ed3-973e-c79d85d222d7)

<sub>Image Credit: DesignCourse</sub>

Step 2: Binding the variable to the number next to the like button

![Set Variables Step 2](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/60fd60f7-3be9-4cc5-b7f7-945ee1034406)

<sub>Image Credit: DesignCourse</sub>

Step 3: Select the button and add interaction - on click - Set variable and add a simple logic by entering `#LikeCount +1`

![Set Variables Step 3](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/7b7e006a-e3ae-48ee-b877-aad584cf4493)

<sub>Image Credit: DesignCourse</sub>

So now when the user clicks on the like button, the number will increase by 1.

### Conditional

Step 1: Set a number variable named 'itemCount' with an initial value of 0.

![Conditional Step 1](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/3278adbd-f879-41dd-a30c-46951b3213f5)

<sub>Image Credit: Figma</sub>

Step 2: Select the button and add interaction - on click - Conditional

![Conditional Step 2](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/905d340a-9b52-44e2-8f91-73f85525be5b)

<sub>Image Credit: Figma</sub>

Step 3: Now you can apply a simple logic to the button by entering:

<b>if #itemCount > 0 set variable #itemCount = #itemCount - 1
else #itemCount > 0 set variable #itemCount = 0</b>


This logic ensures that when users click on the '-' button, the number will automatically decrease by 1. However, we want to prevent the number from going below 0. So, the 'else' condition ensures that if the current #itemCount is greater than 0, it will decrement by 1; otherwise, it will be set to 0. With this condition, #itemCount will never be negative.

## 4. Dev-Mode

Features:

- Support different coding languages and dimension units
- Communicate with your designer more easily
- Download Assets in one click
- Compare changes to see the latest
- Component playground
- Figma for VScode

<img width="100%" alt="Dev Mode Toggle" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/f01c6aa8-aa86-42c7-b6e3-6afd9e6267af">

Dev-Mode is an incredibly amazing tool that brings design and development closer than ever before, making the job for developers easier and more convenient.

### Support different coding languages and dimension units

![feature1](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/8c57b9a1-1515-4a50-938e-f4a96f0daddd)

Generate production-ready CSS, iOS, or Android code snippets from your design—or use a plugin to customize code for whatever framework you’re using.

### Communicate with your designer more easily

![feature2](https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/3fedfc70-3779-4e19-a6ec-320ee5c49285)

With the "Ready for dev" icon, developers can easily identify which pages or projects have been completed by the designer and start the development process. Additionally, it provides clarity on the most recent design changes, allowing developers to stay informed about updates and make necessary changes accordingly.

### Download Assets in one click

<img width="100%" alt="feature3" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/f8b2b1d7-400d-4f95-88fe-81e571f44a46">

Developers can download assets from the file with just one click and choose the specific document type they need. Even if the assets are not displayed in the Asset area, they can still export them by clicking the export button.

### Compare changes to see the latest

<img width="100%" alt="feature4" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/76baf656-bb23-4210-9743-5f97415dd4e7">

With this feature, developers can now easily see what changes were made by the designers between two versions.

### Component playground

<img width="100%" alt="feature5" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/92e6d469-28bb-4c2d-9c5a-5246225de7b7">

In the component playground, developers are able to check all the variants of a component without worrying about impacting the design.

### Figma for VScode

<img width="100%" alt="feature6" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/341d9d3c-dd2f-4361-ae43-e1cc5885b993">

With the Figma plugin on VSCode, you can put your code and the design side by side, allowing you to inspect Figma files, collaborate with designers, receive notifications, and get code suggestions to build faster.

### References

- [Mizko- Figma's CONFIG 2023 Updates Explained | Real Examples](https://www.youtube.com/watch?v=jBXy30VwC_U&t=1097s)
- [Figma Learn](https://help.figma.com/hc/en-us)
- [DesignCourse- Figma Variables & Advanced Prototyping - Crash Course](https://www.youtube.com/watch?v=Tx45NcbU6aA&t=224s)
- [CoderOne- Figma VSCode Extension!! Convert Design to Code!](https://www.youtube.com/watch?v=sNK-cPmnx94)
