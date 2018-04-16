/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/js/manual/separateManufacturers.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/js/manual/separateManufacturers.js":
/*!***************************************************!*\
  !*** ./public/js/manual/separateManufacturers.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let products = document.querySelectorAll('.items-box__item');\nconst parentEl = document.querySelector('.items-box');\n\n// loops through products\nfor (let i = 0; i < products.length; i++) {\n    if(products[i - 1]) {\n        // if there is a previous product, check if the class name is same\n        if(!(products[i].getAttribute('class') == products[i - 1].getAttribute('class'))) {\n            let el = createElementFromHTML(products[i].getAttribute('manufacturer'));\n            parentEl.insertBefore(el, products[i]);\n        }   \n    } else {\n        let el = createElementFromHTML(products[i].getAttribute('manufacturer'));\n        parentEl.insertBefore(el, products[i]);\n    }\n}\n\nfunction createElementFromHTML(manufacturer) {\n    let element = document.createElement('div');\n    element.setAttribute('class', 'items-box__item--separator');\n    element.innerHTML = manufacturer.trim();\n    return element;\n}\n\n\n//# sourceURL=webpack:///./public/js/manual/separateManufacturers.js?");

/***/ })

/******/ });