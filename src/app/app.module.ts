import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutes } from './routes';
import { AppProviders } from './providers';
import { AppImports } from './imports';
import { AppDeclarations, EntryComponents } from './declarations';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [ AppDeclarations ],
  imports: [ AppImports ],
  providers: [ AppProviders ],
  bootstrap: [ AppComponent ],
  entryComponents: [ EntryComponents ]
})
export class AppModule { }
