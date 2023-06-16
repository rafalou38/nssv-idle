import { ApplicationSettings } from "@nativescript/core";
import { writable } from "svelte/store";

export const userBits = writable(ApplicationSettings.getNumber("user-bits", 0))
userBits.subscribe(newVal => {
    ApplicationSettings.setNumber("user-bits", newVal);
})