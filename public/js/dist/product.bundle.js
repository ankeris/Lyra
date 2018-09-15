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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/js/manual/product/description.js":
/*!*************************************************!*\
  !*** ./public/js/manual/product/description.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const [normalDescBtn, techDescBtn] = [document.querySelector('.normal'), document.querySelector('.technical')];\r\nconst [normalDesc, techDesc] = [document.querySelector('.description-normal'), document.querySelector('.description-technical')];\r\n\r\nnormalDescBtn.addEventListener('click', function(e){\r\n    e.target.classList.add('active');\r\n    techDescBtn.classList.remove('active');\r\n    techDesc.classList.add('hidden');\r\n    normalDesc.classList.remove('hidden');\r\n\r\n    normalDesc.classList.add('fade-in');\r\n    setTimeout(() => normalDesc.classList.remove(\"fade-in\"), 500);\r\n});\r\n\r\ntechDescBtn.addEventListener('click', function(e){\r\n    e.target.classList.add('active');\r\n    normalDescBtn.classList.remove('active');\r\n    normalDesc.classList.add('hidden');\r\n    techDesc.classList.remove('hidden');\r\n\r\n    techDesc.classList.add('fade-in');\r\n    setTimeout(() => techDesc.classList.remove(\"fade-in\"), 500);\r\n});\n\n//# sourceURL=webpack:///./public/js/manual/product/description.js?");

/***/ }),

/***/ "./public/js/manual/product/highlightProduct.js":
/*!******************************************************!*\
  !*** ./public/js/manual/product/highlightProduct.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// effect variable\r\nconst opacity = 0.5;\r\n\r\nconst highlighted = document.querySelector('#currentHighlight');\r\nconst images = document.querySelectorAll('.items-box__item-images--item');\r\n\r\nimages[0].style.opacity = opacity;\r\n\r\nimages.forEach(img => img.addEventListener('click', changeImage));\r\n\r\nfunction changeImage(newImage) {\r\n\timages.forEach(img => (img.style.opacity = 1))\r\n\thighlighted.style.backgroundImage = `url('${newImage.target.src}')`;\r\n\thighlighted.classList.add('fade-in');\r\n\tnewImage.target.style.opacity = opacity;\r\n\tsetTimeout(() => highlighted.classList.remove(\"fade-in\"), 500);\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/manual/product/highlightProduct.js?");

/***/ }),

/***/ 3:
/*!******************************************************************************************************!*\
  !*** multi ./public/js/manual/product/description.js ./public/js/manual/product/highlightProduct.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./public/js/manual/product/description.js */\"./public/js/manual/product/description.js\");\nmodule.exports = __webpack_require__(/*! ./public/js/manual/product/highlightProduct.js */\"./public/js/manual/product/highlightProduct.js\");\n\n\n//# sourceURL=webpack:///multi_./public/js/manual/product/description.js_./public/js/manual/product/highlightProduct.js?");

/***/ })

/******/ });