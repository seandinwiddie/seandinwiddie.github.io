"use strict";!function(n){var prlx=function(n,e){function t(n){var t=document.querySelectorAll(n);if(!t.length)return!1;var i=[];return r(t,function(n){i.push({parent:n})}),o(i,function(n){n.image=n.parent.querySelector(e)}),i}function i(){return"function"==typeof requestAnimationFrame&&!/iP(ad|hone|od).*OS\s7.*/.test(navigator.userAgent)}function o(n,e){for(var t=0;t<n.length;t++)e(n[t])}function r(n,e){return n.length?void o(n,e):void e(n)}function a(){function n(n){n.style.display="block"}o(d,function(e){e.image&&n(e.image)})}function c(){u(),window.addEventListener("resize",function(){return u()})}function f(n){return n.getBoundingClientRect().height}function u(){var n=window.innerHeight;d.forEach(function(e){if(e.image){var t=f(e.parent),i=e.parent.offsetTop;e.distanceToVisible=i-n,e.height=t,e.offset=e.parent.offsetTop,e.parallaxSpace=f(e.image)-t,e.scrollSpace=t+n}})}function s(n,e){var t=e>=n.distanceToVisible,i=e>=n.height+n.offset;if(t&&!i){var o=e-n.distanceToVisible,r=o-n.scrollSpace/2,a=n.parallaxSpace/n.scrollSpace,c=parseFloat((r*a).toFixed(1));n.image.style[g]="translateY("+c*-1+"px)"}}function l(){requestAnimationFrame(function(){var n=window.pageYOffset;d.forEach(function(e){return s(e,n)}),l()})}function p(){l()}if(!n||!e)return!1;var d=t(n),g="webkitTransform"in document.body.style?"webkitTransform":"transform";return!!d&&(a(),i()&&(c(),p()),{recalculate:function(){u()}})};"object"==typeof module?module.exports=prlx:n.prlx=prlx}(this);
/* ------------------------------------------------------------------------
 * Verso: verso.parallax.js
 * Initialises parallax backgrounds
 * ------------------------------------------------------------------------
 * Copyright 2017 Oxygenna LTD
 * ------------------------------------------------------------------------ */

jQuery(document).ready(function($) {
    /********************
     Parallax Backgrounds
    /*******************/
    prlx('body:not(.verso-agent-touch) .section', '.section-bg-image-paralax');
});
