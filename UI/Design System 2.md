# Design System

## What is Design System

Design System 是結合了所有與品牌相關的Brand Voice and Tone（亦可說是Brand Personality)、Design Guidelines、準則、Asset 等元素的文件，每個項目都可以再細分為更多子項目，而Design System 不僅僅只是著重於視覺設計上的準則，他也可以涵括至開發準則、文件撰寫規範、UX Writing 方向等許多面向，而每個企業及品牌會根據自身的需求，建立屬於自己的 Design System，所以你可以在很多地方看到大大小小不同的 Design System範本。
其中最常被人所用的 Design System 為：
[Apple-Human Interface Guideline](https://developer.apple.com/design/human-interface-guidelines/)
[Google-Material Design](https://m3.material.io)

不同企業也會根據其 Brand Personality 為自己的 Design System 取名，例如：
[Shopify-Polaris](https://polaris.shopify.com)
[Buzzfeed-Solid](https://solid.buzzfeed.com/?source=post_page-----520235d7de76--------------------------------)

## Design System Check List

不同專案會根據不同品牌需求會產出不同的Design System Check List，以下舉例一些常見的項目：
[Build better design systems](https://www.designsystemchecklist.com)

### Design Language

- Brand

  1. Vision
  2. General Design Principle
  3. Tone and Voice

- Guideline

  1. Accessability
  2. Writting Guideline
  3. Microcopy Guideline

### Foundations

- Color
  1. Primary
  2. Secondary
  3. Netural
  4. State Color
  5. Text Color
  6. Surface Color
  7. Dark mode
  8. Guideline

- Layout
  1. Grid
  2. Break Point
  3. Sapcing
  
- Typographic
  1. Font (for different language)
  2. Relation to Grid
  3. Guideline

- Elevation
  1. Shadows
  2. Z-Index

- Motion
  1. Easing
  2. Duration

- Icongraphic
  1. Style
  2. Naming rules
  3. Keywords
  4. Relation to Grid
  5. Guideline
 

### Core Component

- Accordion
- Alert
- Avatar
- Badge
- Buttons
- Breadcrumbs
- Calendar Picker
- Card
- Check Box
- Devider
- Dropdown
- Icons
- Loading Indicator
- Modal Dialog (Pop out)
- Pagination
- Progress Bar
- Input Field
- Input Radio
- Switch
- Tabs
- Tables
- Text Field
- Toast
- Tool Tips

### Maintenance

- Documentation
  1. Design System Principle
  2. Getting Started
  3. How to use
  4. Example

- Libraries
  1. Design Token (Variable)
  2. Styles
  3. Components

- Team Process
  1. Project Tracker
  2. Github Issue Guideline

- Community Support
  1. Template
  2. Plugin
  3. Widget

[更多 Check List 請參考](https://www.figma.com/file/7Zj9m3bpSwUVBfi4FGfbh6/Design-System-Checklist-(Community)?type=design&node-id=0%3A1&mode=design&t=qrsqUGtAnAkkbqOF-1)

## 於 Figma 建立 Design System 之方法及規則

### Components
#88 

### Variables

設計師在撰寫 Design System 的同時也須根據Design System的規格建立完整的 Variables

1. 先 Primitives： 將 Design System 中用到的所有 Color、Spacing、Radius 的數值單獨建立在 Primitives Collection中，並準確命名，此階段只需對該數值進行描述，不需定義用途。
<img width="810" alt="截圖 2024-01-10 下午3 40 24" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/18e13e5d-ce1c-4840-899c-9b289ca2f7a0">

2. 另外新增 Token的 Collection，並用 Primitives 當中設定好的數值套用在不同的 Token 上，此階段類似於將 Primitives 進行功能分類，定義每個設計規範。
<img width="807" alt="截圖 2024-01-10 下午3 40 47" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/d2077a66-36bb-4f09-b17f-32b0dab53532">

有效利用 Variable可以大幅度的增加工作效率外，對於設計的調整彈性更高，未來在定義不同 Mode 或是 Device，甚至針對顏色或數值進行調整，都可以有效且快速，並降低出錯機率。
關於 Variable的邏輯可參考：
[Bringing the Design and Development World Closer Than Ever Before](https://mermer.com.tw/knowledge-management/km-20230809001)
#87 


### Styles

設計師在撰寫 Design System 的同時也須根據Design System的規格建立完整的 Style，這裡是針對 Design System 中的 Typographic 、Elevation及 Layout 進行設定。

<img width="240" alt="截圖 2024-01-10 下午3 53 28" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/b2d2ae76-db4a-4ece-8c9f-d4e18d5f46f9">


### Publish

將所有 Components、Variables及Styles設定好之後，需Publish Library，以便日後設計文件做使用。
<img width="461" alt="截圖 2024-01-10 下午3 58 18" src="https://github.com/CAFECA-IO/KnowledgeManagement/assets/98379087/31d39ebb-c98e-40f2-a52c-067ac282cc63">


## Reference

- [What is a Design System? Design Systems 101 for Designers](https://www.youtube.com/watch?v=wc5krC28ynQ)
- [Welcome to design systems - Lesson 1 : Introduction to design systems](https://www.youtube.com/watch?v=YLo6g58vUm0)
- [Build better design systems](https://www.designsystemchecklist.com)
- [Mohsen-Design System Checklist](https://www.figma.com/community/file/875222888436956377/design-system-checklist)
