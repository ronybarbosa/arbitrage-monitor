import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ArbitrageComponent } from "app/components/arbitrage/arbitrage.component";

export const COMPONENTS = [
    ArbitrageComponent
  ];
  
  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
  })
  export class ComponentsModule {}