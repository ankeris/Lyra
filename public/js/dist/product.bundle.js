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

eval("var _ref = [document.querySelector('.normal'), document.querySelector('.technical')],\n    normalDescBtn = _ref[0],\n    techDescBtn = _ref[1];\nvar _ref2 = [document.querySelector('.description-normal'), document.querySelector('.description-technical')],\n    normalDesc = _ref2[0],\n    techDesc = _ref2[1];\nnormalDescBtn.addEventListener('click', function (e) {\n  e.target.classList.add('active');\n  techDescBtn.classList.remove('active');\n  techDesc.classList.add('hidden');\n  normalDesc.classList.remove('hidden');\n  normalDesc.classList.add('fade-in');\n  setTimeout(function () {\n    return normalDesc.classList.remove('fade-in');\n  }, 500);\n});\ntechDescBtn.addEventListener('click', function (e) {\n  e.target.classList.add('active');\n  normalDescBtn.classList.remove('active');\n  normalDesc.classList.add('hidden');\n  techDesc.classList.remove('hidden');\n  techDesc.classList.add('fade-in');\n  setTimeout(function () {\n    return techDesc.classList.remove('fade-in');\n  }, 500);\n});\n\n//# sourceURL=webpack:///./public/js/manual/product/description.js?");

/***/ }),

/***/ "./public/js/manual/product/highlightProduct.js":
/*!******************************************************!*\
  !*** ./public/js/manual/product/highlightProduct.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// effect variable\nvar opacity = 0.5;\nvar highlighted = document.querySelector('#currentHighlight');\nvar images = document.querySelectorAll('.items-box__item-images--item');\nimages[0].style.opacity = opacity;\nimages.forEach(function (img) {\n  return img.addEventListener('click', changeImage);\n});\n\nfunction changeImage(newImage) {\n  images.forEach(function (img) {\n    return img.style.opacity = 1;\n  });\n  highlighted.style.backgroundImage = \"url('\".concat(newImage.target.src, \"')\");\n  highlighted.classList.add('fade-in');\n  newImage.target.style.opacity = opacity;\n  setTimeout(function () {\n    return highlighted.classList.remove('fade-in');\n  }, 500);\n}\n\n//# sourceURL=webpack:///./public/js/manual/product/highlightProduct.js?");

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