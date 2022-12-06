import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetListComponent } from './components/asset-list/asset-list.component';
import { AssetListService } from './asset-list.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TableFiltersComponent } from './components/filters/filters.component';


@NgModule({
  declarations: [
    AssetListComponent,
    TableFiltersComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    PanelModule,
    TabViewModule,
    ChartModule,
    ProgressSpinnerModule,
    ToggleButtonModule
  ],
  exports: [
    AssetListComponent
  ],
  providers: [
    AssetListService
  ]
})
export class AssetListModule { }
