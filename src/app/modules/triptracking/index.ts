import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@services';
import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';
import { AuthGuard } from '@services';

import { TripTrackingComponent } from './ttmap.comp';
import { TTMapService } from '@services/master';
import { Globals } from '@models';
import { TimeAgoPipe } from '@pipe/timeago';
import { format } from '@pipe/format';
import { ADHOST } from '@directives';

import { InfoComponent } from './info/info.comp';
import { TripsComponent } from './trips/trips.comp';
import { HistoryComponent } from './history/history.comp';

import { LazyLoadEvent, DataTableModule, AutoCompleteModule, GMapModule, SelectButtonModule, CalendarModule, SliderModule } from 'primeng/primeng';

export const config: SocketIoConfig = {
  url: Globals.socketurl, options: {}
};

export const routes = [
  {
    path: '', children: [
      {
        path: '', component: TripTrackingComponent, canActivate: [AuthGuard],
        data: { "module": "", "submodule": "tt", "rights": "view", "urlname": "/triptracking" }
      }
    ]
  },
];

@NgModule({
  declarations: [
    TripTrackingComponent,
    TimeAgoPipe,
    InfoComponent,
    TripsComponent,
    HistoryComponent,
    ADHOST,
    format
  ],

  entryComponents: [InfoComponent, TripsComponent, HistoryComponent],
  
  imports: [
    CommonModule, FormsModule, SharedComponentModule, SocketIoModule.forRoot(config),
    RouterModule.forChild(routes), DataTableModule, AutoCompleteModule, GMapModule, SelectButtonModule,
    CalendarModule, SliderModule
  ],

  providers: [AuthGuard, TTMapService]
})

export class TripTrackingModule {
  constructor() {

  }

  public static routes = routes;
}
