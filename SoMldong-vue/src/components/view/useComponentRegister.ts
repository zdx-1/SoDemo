import { tryOnUnmounted } from '@vueuse/core';
import { add, del } from './componentMap';
import type { Component } from 'vue';

export function useComponentRegister(compName: string | String, comp: Component) {
  add(compName, comp);
  tryOnUnmounted(() => {
    del(compName);
  });
}
