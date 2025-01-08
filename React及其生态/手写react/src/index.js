import {createElement, render} from "./react.js";
import MyComp from "./MyComp.js";

const container = document.getElementById('root')

render(createElement(MyComp), container)
