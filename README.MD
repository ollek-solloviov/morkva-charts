# Responsive Angular 4 Charts module
Oleksandr Soloviov © 2017 | [MORKVADEV.com](https://morkvadev.com)

License [MIT](https://opensource.org/licenses/MIT)

Note that our charts are still in alpha!
#
# Install

### Install package from NPM:

```
npm install --save morkva-charts
```

### Install required packages:

```
// D3js
npm install --save d3
npm install --save-dev @types/d3

// Element resize event
npm install --save element-resize-event
npm install --save @types/element-resize-event
```

# Import

### Path location strategy

We provide the cross browser support of gradients, shadows and another svg filters that can appear. To use these all in different browser we recommend to define Path location strategy or Hash location strategy in app.module.ts

```
providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
```
or
```
providers: [Location, { provide: LocationStrategy, useClass: HashLocationStrategy }]
```

### Import chart module:

```
import { ChooseYourChartsModule } from 'morkva-charts/core';

@NgModule({
imports: [ ChooseYourChartsModule, ... ]
```

# Customize

Use @Inputs predefined variables:

Morkva charts have more than 100 variables to create a unique design for your Angular 4 app. The high performance charts will appear in browser using component tag:

```
<mc-ChooseYour-chart
    *ngIf="your_data"
    [data]="your_data"
></mc-ChooseYour-chart>
```

Read our [DOCUMENTATION](https://morkvadev.com/#/docs) to start coding. You can find there some ideas and examples which you are free to use!