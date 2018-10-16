import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutes } from './routes';
import { AppProviders } from './providers';
import { AppImports } from './imports';
import { AppDeclarations, EntryComponents } from './declarations';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [ AppDeclarations, MenuComponent, TableComponent ],
  imports: [ AppImports ],
  providers: [ AppProviders ],
  bootstrap: [ AppComponent ],
  entryComponents: [ EntryComponents ]
})
export class AppModule { }
