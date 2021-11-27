import { Injector } from '@angular/core';

export let appInjector: Injector;

export const setAppInjector = (injector: Injector) => {
  if (appInjector) {
    console.error('AppInjector was already set');
  } else {
    appInjector = injector;
  }
};
