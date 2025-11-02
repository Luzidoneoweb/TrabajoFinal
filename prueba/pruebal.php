<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="content-language" content="en">

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="HandheldFriendly" content="true">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=0">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="theme-color" content="#F0EEDF">

    <meta name="google" value="notranslate">

    <title>Audios temas 13/14 - Readlang</title>

    

    <link href="https://fonts.googleapis.com/css?family=Jost:200,300,300italic,400,400italic,500,600,700" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="/external/font-awesome/css/font-awesome.min.css">
    

    <link rel="stylesheet" type="text/css" href="https://readlang.com/css/app.css">
   
    <link rel="shortcut icon" href="https://readlang.com/favicon-16.png">
    <link rel="apple-touch-icon-precomposed" href="https://readlang.com/favicon-152.png">
    <link rel="apple-touch-icon" sizes="196x196" href="/favicon-196.png">
    <link rel="icon" sizes="32x32" href="/favicon-32.png">
    <link rel="icon" sizes="48x48" href="/favicon-48.png">
    <link rel="icon" sizes="152x152" href="/favicon-152.png">
    <link rel="icon" sizes="196x196" href="/favicon-196.png">
    <link rel="manifest" href="https://readlang.com/manifest.json">

    <script async="" src="https://www.googletagmanager.com/gtag/js?id=G-SZ1M22CFNJ"></script><script>
      // Super crude sampling method to reduce volume of error reports
      const shouldReportErrors = !/localhost/.test(location.host) && (Math.random() < 0.3);
      
      if (shouldReportErrors) {
        var _rollbarConfig = {
          accessToken: "2174dfeba5b7427fa352fae8b9bd61ec",
          captureUncaught: true,
          captureUnhandledRejections: true,
          payload: {
            environment: "production",
            client: {
              javascript: {
                source_map_enabled: true,
                code_version: "3722e262e2730995f27a4a546d461a4ae2cf87f7",
                guess_uncaught_frames: true,
              },
            },
          },
          // Limit the number of error reports per page load
          maxItems: 1,
          checkIgnore: (isUncaught, args, payload) => {
            // Ignore "errors" from 4XX responses, since these are expected behavior
            const status = payload?.body?.trace?.extra?.jqXHR?.status ??
              payload?.body?.trace?.extra?.status;
            if (status && /^4[0-9]{2}$/.test(status)) {
              console.log("Ignoring 4XX error")
              return true;
            }
            return false;
          },
        };
        // Rollbar Snippet
        !function(r){function o(n){if(e[n])return e[n].exports;var t=e[n]={exports:{},id:n,loaded:!1};return r[n].call(t.exports,t,t.exports,o),t.loaded=!0,t.exports}var e={};return o.m=r,o.c=e,o.p="",o(0)}([function(r,o,e){"use strict";var n=e(1),t=e(4);_rollbarConfig=_rollbarConfig||{},_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.2.10/rollbar.min.js",_rollbarConfig.async=void 0===_rollbarConfig.async||_rollbarConfig.async;var a=n.setupShim(window,_rollbarConfig),l=t(_rollbarConfig);window.rollbar=n.Rollbar,a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,l)},function(r,o,e){"use strict";function n(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function t(r,o){this.options=r,this._rollbarOldOnError=null;var e=s++;this.shimId=function(){return e},window&&window._rollbarShims&&(window._rollbarShims[e]={handler:o,messages:[]})}function a(r,o){var e=o.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShims={},r._rollbarWrappedError=null;var t=new p(o);return n(function(){o.captureUncaught&&(t._rollbarOldOnError=r.onerror,i.captureUncaughtExceptions(r,t,!0),i.wrapGlobals(r,t,!0)),o.captureUnhandledRejections&&i.captureUnhandledRejections(r,t,!0);var n=o.autoInstrument;return o.enabled!==!1&&(void 0===n||n===!0||"object"==typeof n&&n.network)&&r.addEventListener&&(r.addEventListener("load",t.captureLoad.bind(t)),r.addEventListener("DOMContentLoaded",t.captureDomContentLoaded.bind(t))),r[e]=t,t})()}function l(r){return n(function(){var o=this,e=Array.prototype.slice.call(arguments,0),n={shim:o,method:r,args:e,ts:new Date};window._rollbarShims[this.shimId()].messages.push(n)})}var i=e(2),s=0,d=e(3),c=function(r,o){return new t(r,o)},p=d.bind(null,c);t.prototype.loadFull=function(r,o,e,t,a){var l=function(){var o;if(void 0===r._rollbarDidLoad){o=new Error("rollbar.js did not load");for(var e,n,t,l,i=0;e=r._rollbarShims[i++];)for(e=e.messages||[];n=e.shift();)for(t=n.args||[],i=0;i<t.length;++i)if(l=t[i],"function"==typeof l){l(o);break}}"function"==typeof a&&a(o)},i=!1,s=o.createElement("script"),d=o.getElementsByTagName("script")[0],c=d.parentNode;s.crossOrigin="",s.src=t.rollbarJsUrl,e||(s.async=!0),s.onload=s.onreadystatechange=n(function(){if(!(i||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{c.removeChild(s)}catch(r){}i=!0,l()}}),c.insertBefore(s,d)},t.prototype.wrap=function(r,o,e){try{var n;if(n="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._rollbar_wrapped&&(r._rollbar_wrapped=function(){e&&"function"==typeof e&&e.apply(this,arguments);try{return r.apply(this,arguments)}catch(e){var o=e;throw"string"==typeof o&&(o=new String(o)),o._rollbarContext=n()||{},o._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=o,o}},r._rollbar_wrapped._isWrap=!0,r.hasOwnProperty))for(var t in r)r.hasOwnProperty(t)&&(r._rollbar_wrapped[t]=r[t]);return r._rollbar_wrapped}catch(o){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,captureEvent,captureDomContentLoaded,captureLoad".split(","),f=0;f<u.length;++f)t.prototype[u[f]]=l(u[f]);r.exports={setupShim:a,Rollbar:p}},function(r,o){"use strict";function e(r,o,e){if(r){var t;"function"==typeof o._rollbarOldOnError?t=o._rollbarOldOnError:r.onerror&&!r.onerror.belongsToShim&&(t=r.onerror,o._rollbarOldOnError=t);var a=function(){var e=Array.prototype.slice.call(arguments,0);n(r,o,t,e)};a.belongsToShim=e,r.onerror=a}}function n(r,o,e,n){r._rollbarWrappedError&&(n[4]||(n[4]=r._rollbarWrappedError),n[5]||(n[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null),o.handleUncaughtException.apply(o,n),e&&e.apply(r,n)}function t(r,o,e){if(r){"function"==typeof r._rollbarURH&&r._rollbarURH.belongsToShim&&r.removeEventListener("unhandledrejection",r._rollbarURH);var n=function(r){var e=r.reason,n=r.promise,t=r.detail;!e&&t&&(e=t.reason,n=t.promise),o&&o.handleUnhandledRejection&&o.handleUnhandledRejection(e,n)};n.belongsToShim=e,r._rollbarURH=n,r.addEventListener("unhandledrejection",n)}}function a(r,o,e){if(r){var n,t,a="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(n=0;n<a.length;++n)t=a[n],r[t]&&r[t].prototype&&l(o,r[t].prototype,e)}}function l(r,o,e){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){for(var n=o.addEventListener;n._rollbarOldAdd&&n.belongsToShim;)n=n._rollbarOldAdd;var t=function(o,e,t){n.call(this,o,r.wrap(e),t)};t._rollbarOldAdd=n,t.belongsToShim=e,o.addEventListener=t;for(var a=o.removeEventListener;a._rollbarOldRemove&&a.belongsToShim;)a=a._rollbarOldRemove;var l=function(r,o,e){a.call(this,r,o&&o._rollbar_wrapped||o,e)};l._rollbarOldRemove=a,l.belongsToShim=e,o.removeEventListener=l}}r.exports={captureUncaughtExceptions:e,captureUnhandledRejections:t,wrapGlobals:a}},function(r,o){"use strict";function e(r,o){this.impl=r(o,this),this.options=o,n(e.prototype)}function n(r){for(var o=function(r){return function(){var o=Array.prototype.slice.call(arguments,0);if(this.impl[r])return this.impl[r].apply(this.impl,o)}},e="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureEvent,captureDomContentLoaded,captureLoad".split(","),n=0;n<e.length;n++)r[e[n]]=o(e[n])}e.prototype._swapAndProcessMessages=function(r,o){this.impl=r(this.options);for(var e,n,t;e=o.shift();)n=e.method,t=e.args,this[n]&&"function"==typeof this[n]&&("captureDomContentLoaded"===n||"captureLoad"===n?this[n].apply(this,[t[0],e.ts]):this[n].apply(this,t));return this},r.exports=e},function(r,o){"use strict";r.exports=function(r){return function(o){if(!o&&!window._rollbarInitialized){r=r||{};for(var e,n,t=r.globalAlias||"Rollbar",a=window.rollbar,l=function(r){return new a(r)},i=0;e=window._rollbarShims[i++];)n||(n=e.handler),e.handler._swapAndProcessMessages(l,e.messages);window[t]=n,window._rollbarInitialized=!0}}}}]);
        // End Rollbar Snippet
      }
    </script>

    <script type="text/javascript">
      "use strict";

      window.READLANG = window.READLANG || {};

      READLANG.gitCommit = "3722e262e2730995f27a4a546d461a4ae2cf87f7";

      READLANG.splitTests = {};
      READLANG.serverTime = 1762015692814;
      READLANG.userID = "66ef3bf418687ae52fdd2bb1";

      window.console = window.console || {};
      window.console.log = window.console.log || function () {};
      window.console.time = window.console.time || function () {};
      window.console.timeEnd = window.console.timeEnd || function () {};
      window.console.assert = window.console.assert || function () {};
      window.console.error = window.console.error || function () {};
    </script>
    <script type="text/javascript" src="/external/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" defer="" src="/src/app.js?bust=3722e262e2730995f27a4a546d461a4ae2cf87f7"></script>
  <link id="openSansFont" rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:400,700"><link id="handwritingFont" href="//fonts.googleapis.com/css?family=Coming+Soon:400,600" rel="stylesheet" type="text/css"></head>
<body onunload="" id="readerPage" class="redesign notouch colorSepia basicLatinFirstLanguage fontSize5 lineHeight2 width3 glossStyleNew alignLeft" data-clickmode="translate" data-spansenabled="enabled">
    <div id="entirePage" class=""><div class="signedOutTopBar">
</div>
<div class="outerContainer">
<div class="container">
  <div id="titleBar" class="titleBar">
    <div class="homeButton">
      <a id="home" href="/previousLibraryOrDashboard" title="Readlang Homepage"><i class="icon-chevron-left"></i>&nbsp;<span class="icon">R</span></a>
      <div class="flashcards tooltip arrowLeft" style="padding:8px 12px;top:-10px;left:105%">
        <h3>Start Practising!</h3>
        <p>We generated <span class="tooltip-readyToStartCount"></span> flashcards for you while you were reading.</p>
      </div>
    </div>

    <div id="title"><div class="titleText">Audios temas 13/14</div></div><div id="streak" class="titleBarWidget"><div class="streakView"><div class="image"><div>
    <svg width="32" height="32" viewBox="0 0 32 32">
      <path d="M 16 30.85 A 14.85 14.85 0 0 0 16 1.1500000000000004" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2.3000000000000007"></path>
      <path d="M 15.999999999999996 1.1500000000000004 A 14.85 14.85 0 0 0 16 30.85" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="2.3000000000000007"></path>
      <path d="M 16 1.1500000000000004 A 14.85 14.85 0 0 0 16 1.1500000000000004" fill="none" stroke="currentColor" stroke-width="2.3000000000000007"></path>
    </svg>
  </div><span>
<svg class="fireIcon" width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5_21)">
<g clip-path="url(#clip1_5_21)">
<path d="M4.62254 0.168746C4.84888 -0.0593792 5.2 -0.0562542 5.42634 0.171871C6.22723 0.981246 6.97879 1.85312 7.68103 2.79687C8.00022 2.34687 8.36295 1.85625 8.75469 1.45625C8.98393 1.225 9.33795 1.225 9.56719 1.45937C10.5712 2.49062 11.4214 3.85312 12.0192 5.14687C12.6083 6.42187 13 7.725 13 8.64375C13 12.6312 10.104 16 6.5 16C2.85536 16 0 12.6281 0 8.64062C0 7.44062 0.516518 5.975 1.31741 4.525C2.12701 3.05312 3.27031 1.51875 4.62254 0.168746ZM6.54933 13C7.28348 13 7.93348 12.7812 8.54576 12.3437C9.76741 11.425 10.0953 9.5875 9.36116 8.14375C9.23058 7.8625 8.89687 7.84375 8.70826 8.08125L7.97701 8.99687C7.78549 9.23437 7.44018 9.22812 7.26027 8.98125C6.78147 8.325 5.92545 7.15312 5.43795 6.4875C5.25513 6.2375 4.90692 6.23437 4.72121 6.48437C3.7404 7.8125 3.2471 8.65 3.2471 9.59062C3.25 11.7312 4.7183 13 6.54933 13Z" fill="currentColor"></path>
</g>
</g>
<defs>
<clipPath id="clip0_5_21">
<rect width="13" height="16" fill="currentColor"></rect>
</clipPath>
<clipPath id="clip1_5_21">
<rect width="13" height="16" fill="currentColor"></rect>
</clipPath>
</defs>
</svg>
</span></div><div class="days">0</div></div></div>
    <div id="walkthroughWidget"></div>


    <div id="dropdownMenu" class="titleBarWidget"><div class="dropdownMenuContainer"><i class="icon icon-ellipsis-vertical menuButton"></i></div></div>

    <div id="sideBarButtonContainer" class="clickable">
      <svg id="sideBarButton" class="clickable" title="Show Sidebar" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 2H35C38.866 2 42 5.13401 42 9V35C42 38.866 38.866 42 35 42H9C5.13401 42 2 38.866 2 35V9C2 5.13401 5.13401 2 9 2Z" stroke="currentColor" stroke-width="4"></path>
        <line x1="28" x2="28" y2="41" stroke="currentColor" stroke-width="4"></line>
        <line x1="32" y1="10" x2="38" y2="10" stroke="currentColor" stroke-width="4"></line>
        <line x1="32" y1="24" x2="38" y2="24" stroke="currentColor" stroke-width="4"></line>
        <line x1="32" y1="17" x2="38" y2="17" stroke="currentColor" stroke-width="4"></line>
      </svg>

      <div class="tooltip arrowRight" style="top:-4px;">
        <h3>More Definitions &nbsp;</h3>
        <div class="closeDialogButton dismissSidebarHint">&nbsp;x&nbsp;</div>
        <p>Click here for more definitions</p>
      </div>
      <!--&#9776;-->
    </div>
    <div class="titleBarWidget"></div>
  </div>
  <div id="mediaPanel">
  </div>
  <div class="bookColumn">
    <div id="bookContent" style="font-family: &quot;Open Sans&quot;, sans-serif;">
      <div id="pageTextViewport" style="overflow-y: hidden; bottom: 118.994px;">
        <div id="pageText" style="opacity: 1; top: 0px; display: block;"><p><span data-p="0">Okay</span> <span data-p="1">,</span> <span data-p="2">I</span> <span data-p="3">can</span> <span data-p="4">help</span> <span data-p="5">you</span> <span data-p="6">with</span> <span data-p="7">that</span><span data-p="8">.</span> <span data-p="9">I</span> <span data-p="10">will</span> <span data-p="11">create</span> <span data-p="12">a</span> <span data-p="13">document</span> <span data-p="14">with</span> <span data-p="15">the</span> <span data-p="16" style="">original</span> <span data-p="17">English</span> <span data-p="18" style="">text</span> <span data-p="19" style="">and</span> <span data-p="20" style="">its</span> <span data-p="21">Spanish</span> <span data-p="22">translation</span> <span data-p="23">on</span> <span data-p="24" style="">separate</span> <span data-p="25">lines</span><span data-p="26">,</span> <span data-p="27">with</span> <span data-p="28">the</span> <span data-p="29">Spanish</span> <span data-p="30">text</span> <span data-p="31">in</span> <span data-p="32" style="">red</span> <span data-p="33">font</span><span data-p="34">.</span> <span data-p="35">Here</span> <span data-p="36">it</span> <span data-p="37">is</span>: <span data-p="38">this</span> : <span data-p="39">Tip</span> <span data-p="40" style="">number</span> <span data-p="41" style="">one</span> <span data-p="42" style="">is</span> <span data-p="43">to</span> <span data-p="44" style="">make</span> <span data-p="45">sure</span> <span data-p="46">to</span> <span data-p="47">address</span> <span data-p="48" style="">the</span> <span data-p="49">cover</span> <span data-p="50">letter</span> <span data-p="51">to</span> <span data-p="52">a</span> <span data-p="53">specific</span> <span data-p="54">person</span><span data-p="55">.</span> <span data-p="56">The</span> <span data-p="57">number</span> <span data-p="58">one</span> <span data-p="59">suggestion</span> <span data-p="60">is</span> <span data-p="61">to</span> <span data-p="62">make</span> <span data-p="63" style="">sure</span> <span data-p="64">you</span> <span data-p="65">address</span> <span data-p="66">your</span> <span data-p="67">cover</span> <span data-p="68">letter</span> <span data-p="69">to</span> <span data-p="70">a</span> <span data-p="71">specific</span> <span data-p="72">person</span><span data-p="73">.</span> <span data-p="74">Generally</span> <span data-p="75">,</span> <span data-p="76">the</span> <span data-p="77">person</span> <span data-p="78">in</span> <span data-p="79" style="">charge</span> <span data-p="80" style="">of</span> <span data-p="81" style="">the</span> <span data-p="82">department</span> <span data-p="83" style="">you're</span> <span data-p="84">applying</span> <span data-p="85">to</span> <span data-p="86">or</span> <span data-p="87" style="">the</span> <span data-p="88">hiring</span> <span data-p="89">manager</span> <span data-p="90">in</span> <span data-p="91">charge</span> <span data-p="92">of</span> <span data-p="93">the</span> <span data-p="94" style="">interview</span> <span data-p="95">.</span> <span data-p="96">If</span> <span data-p="97">you</span> <span data-p="98">don't</span> <span data-p="99">know</span> <span data-p="100">the</span> <span data-p="101">correct</span> <span data-p="102" style="">name</span><span data-p="103" style="">,</span> <span data-p="104" style="">we</span> <span data-p="105">suggest</span> <span data-p="106" style="">you</span> <span data-p="107">contact</span> <span data-p="108">the</span> <span data-p="109">company</span> <span data-p="110" style="">and</span> <span data-p="111">find</span> <span data-p="112">out</span> <span data-p="113">who</span> <span data-p="114">it</span> <span data-p="115">will</span> <span data-p="116">be</span><span data-p="117">.</span> <span data-p="118">Our</span> <span data-p="119">second</span> <span data-p="120">tip</span> <span data-p="121">is</span> <span data-p="122">to</span> <span data-p="123">avoid</span> <span data-p="124">simply</span> <span data-p="125" style="">repeating</span> <span data-p="126">the</span> <span data-p="127">information</span> <span data-p="128">in</span> <span data-p="129">your</span> <span data-p="130">resume</span><span data-p="131">.</span> <span data-p="132">Instead</span><span data-p="133">,</span> <span data-p="134">use</span> <span data-p="135">your</span> <span data-p="136">cover</span> <span data-p="137">letter</span> <span data-p="138">to</span> <span data-p="139">introduce</span> <span data-p="140">and</span> <span data-p="141" style="">highlight</span> <span data-p="142">your</span> <span data-p="143">personality</span><span data-p="144">,</span> <span data-p="145" style="">curiosity</span><span data-p="146">,</span> <span data-p="147" style="">and</span> <span data-p="148" style="">your</span> <span data-p="149" style="">level</span> <span data-p="150">of</span> <span data-p="151">interest</span> <span data-p="152">in</span> <span data-p="153">the</span> <span data-p="154">field</span> <span data-p="155">you're</span> <span data-p="156">applying</span> <span data-p="157" style="">to</span> <span data-p="158">work</span> <span data-p="159">in</span> <span data-p="160">.</span> <span data-p="161">Our</span> <span data-p="162">third</span> <span data-p="163">tip</span> <span data-p="164">is</span> <span data-p="165">to</span> <span data-p="166">keep</span> <span data-p="167">it</span> <span data-p="168">short</span> <span data-p="169">and</span> <span data-p="170">simple</span> <span data-p="171">yet</span> <span data-p="172">dynamic</span><span data-p="173" style="">.</span> <span data-p="174">Definitely</span> <span data-p="175" style="">not</span> <span data-p="176" style="">more</span> <span data-p="177" style="">than</span> <span data-p="178">one</span> <span data-p="179">page</span> <span data-p="180">and</span> <span data-p="181" style="">probably</span> <span data-p="182">closer</span> <span data-p="183">to</span> <span data-p="184">half</span> <span data-p="185">a</span> <span data-p="186">page</span><span data-p="187">.</span> <span data-p="188" style="">Definitely</span> <span data-p="189">no</span> <span data-p="190">more</span> <span data-p="191">than</span> <span data-p="192">one</span> <span data-p="193">page</span> <span data-p="194">and</span> <span data-p="195">probably</span> <span data-p="196">closer</span> <span data-p="197">to</span> <span data-p="198">half</span> <span data-p="199">a</span> <span data-p="200">page</span> <span data-p="201">.</span> <span data-p="202">Three</span> <span data-p="203">paragraphs</span> <span data-p="204">should</span> <span data-p="205">do</span> <span data-p="206">the</span> <span data-p="207">trick</span><span data-p="208">.</span> <span data-p="209">should</span> <span data-p="210">be</span> <span data-p="211">enough</span> <span data-p="212">.</span> <span data-p="213">Resist</span> <span data-p="214">the</span> <span data-p="215">urge</span> <span data-p="216">to</span> <span data-p="217">ramble</span> <span data-p="218">on</span> <span data-p="219" style="">and</span> <span data-p="220" style="">instead</span> <span data-p="221" style="">dive</span> <span data-p="222">right</span> <span data-p="223" style="">into</span> <span data-p="224">the</span> <span data-p="225">interesting</span> <span data-p="226">parts</span> <span data-p="227" style="">right</span> <span data-p="228">away</span><span data-p="229">.</span> <span data-p="230">Resist</span> <span data-p="231">the</span> <span data-p="232">urge</span> <span data-p="233">to</span> <span data-p="234">ramble</span> <span data-p="235" style="">on</span> <span data-p="236">and</span> <span data-p="237">instead</span> <span data-p="238">dive</span> <span data-p="239">right</span> <span data-p="240">into</span> <span data-p="241">the</span> <span data-p="242">interesting</span> <span data-p="243">parts</span> <span data-p="244">right</span> <span data-p="245">away</span> <span data-p="246">.</span> <span data-p="247">14</span> <span data-p="248">.</span> <span data-p="249">Unit</span> <span data-p="250" style="">14</span><span data-p="251">.</span> <span data-p="252">6</span> <span data-p="253">New</span> <span data-p="254">English</span> <span data-p="255">From</span> <span data-p="256">BBC</span> <span data-p="257">Learning</span> <span data-p="258">English</span><span data-p="259">.</span><span data-p="260">com</span> <span data-p="261">6</span> <span data-p="262">New</span> <span data-p="263">English</span> <span data-p="264">from</span> <span data-p="265">BBC</span> <span data-p="266">Learning</span> <span data-p="267">English</span><span data-p="268">.</span><span data-p="269">com</span> <span data-p="270">Hello</span> <span data-p="271">,</span> <span data-p="272">I'm</span> <span data-p="273">Rob</span><span data-p="274">,</span> <span data-p="275">welcome</span> <span data-p="276">to</span> <span data-p="277">6</span> <span data-p="278">Minute</span> <span data-p="279">English</span> <span data-p="280">.</span> <span data-p="281">With</span> <span data-p="282">me</span> <span data-p="283">in</span> <span data-p="284">the</span> <span data-p="285">studio</span> <span data-p="286">today</span> <span data-p="287">is</span> <span data-p="288">Neil</span><span data-p="289">,</span> <span data-p="290">hello</span><span data-p="291">,</span> <span data-p="292">Neil</span><span data-p="293">.</span> <span data-p="294">With</span> <span data-p="295">me</span> <span data-p="296">in</span> <span data-p="297">the</span> <span data-p="298">studio</span> <span data-p="299">today</span> <span data-p="300">is</span> <span data-p="301">Neil</span><span data-p="302">,</span> <span data-p="303">hello</span><span data-p="304">,</span> <span data-p="305">Neil</span> <span data-p="306">.</span> <span data-p="307">Hello</span> <span data-p="308">there</span> <span data-p="309">,</span> <span data-p="310">Rob</span><span data-p="311">.</span> <span data-p="312">Hi</span> <span data-p="313">Rob</span><span data-p="314">.</span> <span data-p="315">Now</span><span data-p="316">,</span> <span data-p="317">I</span> <span data-p="318">bet</span> <span data-p="319">you</span> <span data-p="320">have</span> <span data-p="321">an</span> <span data-p="322">impressive</span> <span data-p="323">CV</span><span data-p="324">,</span> <span data-p="325">Neil</span> <span data-p="326">.</span> <span data-p="327">CV</span> <span data-p="328">is</span> <span data-p="329">short</span> <span data-p="330">for</span> <span data-p="331">VTA</span> <span data-p="332">curriculum</span> <span data-p="333">.</span> <span data-p="334">CV</span> <span data-p="335">is</span> <span data-p="336">short</span> <span data-p="337">for</span> <span data-p="338">curriculum</span> <span data-p="339">vitae</span> <span data-p="340">.</span> <span data-p="341">That's</span> <span data-p="342">a</span> <span data-p="343">Latin</span> <span data-p="344">expression</span> <span data-p="345">we</span> <span data-p="346">use</span> <span data-p="347">for</span> <span data-p="348">the</span> <span data-p="349">document</span> <span data-p="350">in</span> <span data-p="351">which</span> <span data-p="352">people</span> <span data-p="353">list</span> <span data-p="354">their</span> <span data-p="355">work</span> <span data-p="356">history</span><span data-p="357">,</span> <span data-p="358">education</span><span data-p="359">,</span> <span data-p="360">interests</span><span data-p="361">,</span> <span data-p="362">and</span> <span data-p="363">abilities</span> <span data-p="364">.</span> <span data-p="365">In</span> <span data-p="366">other</span> <span data-p="367">parts</span> <span data-p="368">of</span> <span data-p="369">the</span> <span data-p="370">English</span>-<span data-p="371">speaking</span> <span data-p="372">world</span><span data-p="373">,</span> <span data-p="374">it's</span> <span data-p="375" style="">called</span> <span data-p="376">a</span> <span data-p="377">resume</span><span data-p="378">.</span> <span data-p="379">Now</span> <span data-p="380">,</span> <span data-p="381">Neil</span><span data-p="382">,</span> <span data-p="383">I</span> <span data-p="384">know</span> <span data-p="385">you're</span> <span data-p="386">a</span> <span data-p="387">very</span> <span data-p="388">good</span> <span data-p="389">teacher</span> <span data-p="390">and</span> <span data-p="391">producer</span><span data-p="392">,</span> <span data-p="393">but</span> <span data-p="394">does</span> <span data-p="395">your</span> <span data-p="396">CV</span> <span data-p="397">actually</span> <span data-p="398">shine</span> <span data-p="399">?</span> <span data-p="400">Well</span> <span data-p="401">,</span> <span data-p="402">I</span> <span data-p="403">hope</span> <span data-p="404">it's</span> <span data-p="405">good</span> <span data-p="406">enough</span> <span data-p="407">to</span> <span data-p="408">impress</span> <span data-p="409">hiring</span> <span data-p="410">managers</span><span data-p="411">,</span> <span data-p="412">but</span> <span data-p="413">it's</span> <span data-p="414">a</span> <span data-p="415">challenge</span> <span data-p="416">to</span> <span data-p="417">prove</span> <span data-p="418">on</span> <span data-p="419">a</span> <span data-p="420">piece</span> <span data-p="421">of</span> <span data-p="422">paper</span> <span data-p="423">or</span> <span data-p="424">online</span> <span data-p="425">document</span> <span data-p="426">that</span> <span data-p="427">you're</span> <span data-p="428">really</span> <span data-p="429">better</span> <span data-p="430">than</span> <span data-p="431">the</span> <span data-p="432">other</span> <span data-p="433">people</span> <span data-p="434">competing</span> <span data-p="435">for</span> <span data-p="436">the</span> <span data-p="437">same</span> <span data-p="438" style="">position</span> <span data-p="439">.</span> <span data-p="440">Today</span> <span data-p="441">we</span> <span data-p="442">'re</span> <span data-p="443">talking</span> <span data-p="444">about</span> <span data-p="445">CVs</span><span data-p="446">,</span> <span data-p="447">and</span> <span data-p="448">you</span> <span data-p="449">'ll</span> <span data-p="450">learn</span> <span data-p="451">some</span> <span data-p="452">words</span> <span data-p="453">related</span> <span data-p="454">to</span> <span data-p="455">this</span> <span data-p="456">topic</span> <span data-p="457">that</span> <span data-p="458">will</span> <span data-p="459">especially</span> <span data-p="460">interest</span> <span data-p="461">job</span> <span data-p="462">seekers</span> <span data-p="463">.</span> <span data-p="464">That</span> <span data-p="465">'s</span> <span data-p="466">what</span> <span data-p="467">we</span> <span data-p="468">call</span> <span data-p="469" style="">"</span><span data-p="470">people</span> <span data-p="471">looking</span> <span data-p="472">for</span> <span data-p="473">work</span><span data-p="474">.</span><span data-p="475">"</span> <span data-p="476">We</span> <span data-p="477" style="">call</span> <span data-p="478">on</span> <span data-p="479">people</span> <span data-p="480">who</span> <span data-p="481" style="">are</span> <span data-p="482" style="">looking</span> <span data-p="483" style="">for</span> <span data-p="484">job</span> <span data-p="485" style="">.</span> <span data-p="486">Yes</span><span data-p="487">,</span> <span data-p="488">and</span> <span data-p="489">job</span> <span data-p="490">seekers</span> <span data-p="491">have</span> <span data-p="492">to</span> <span data-p="493">worry</span> <span data-p="494">about</span> <span data-p="495">having</span> <span data-p="496">an</span> <span data-p="497">impressive</span> <span data-p="498">CV</span> <span data-p="499">,</span> <span data-p="500" style="">so</span> <span data-p="501">they</span> <span data-p="502">get</span> <span data-p="503">that</span> <span data-p="504">call</span> <span data-p="505">for</span> <span data-p="506">a</span> <span data-p="507">job</span> <span data-p="508">interview</span><span data-p="509">.</span> <span data-p="510">Yes</span><span data-p="511">,</span> <span data-p="512">and</span> <span data-p="513">job</span> <span data-p="514">seekers</span> <span data-p="515">have</span> <span data-p="516">to</span> <span data-p="517">worry</span> <span data-p="518">about</span> <span data-p="519">having</span> <span data-p="520">an</span> <span data-p="521">impressive</span> <span data-p="522">CV</span><span data-p="523">,</span> <span data-p="524">so</span> <span data-p="525">they</span> <span data-p="526">get</span> <span data-p="527">that</span> <span data-p="528">call</span> <span data-p="529">for</span> <span data-p="530">a</span> <span data-p="531">job</span> <span data-p="532">interview</span> <span data-p="533">.</span> <span data-p="534">Yes</span> <span data-p="535">,</span> <span data-p="536">the</span> <span data-p="537">CV</span> <span data-p="538">is</span> <span data-p="539">just</span> <span data-p="540">the</span> <span data-p="541">beginning</span><span data-p="542">.</span> <span data-p="543">beginning</span> <span data-p="544">.</span> <span data-p="545">And</span> <span data-p="546">as</span> <span data-p="547">you</span> <span data-p="548">mentioned</span> <span data-p="549">job</span> <span data-p="550">interviews</span><span data-p="551">,</span> <span data-p="552">I'll</span> <span data-p="553">ask</span> <span data-p="554">you</span> <span data-p="555">a</span> <span data-p="556">question</span> <span data-p="557">all</span> <span data-p="558">about</span> <span data-p="559">this</span> <span data-p="560">.</span> <span data-p="561">According</span> <span data-p="562">to</span> <span data-p="563">a</span> <span data-p="564">recent</span> <span data-p="565">survey</span><span data-p="566">,</span> <span data-p="567">managers</span> <span data-p="568">decide</span> <span data-p="569">quite</span> <span data-p="570">quickly</span> <span data-p="571">whether</span> <span data-p="572">they're</span> <span data-p="573">going</span> <span data-p="574">to</span> <span data-p="575">really</span> <span data-p="576">consider</span> <span data-p="577">giving</span> <span data-p="578">a</span> <span data-p="579">candidate</span> <span data-p="580">a</span> <span data-p="581">job</span> <span data-p="582">or</span> <span data-p="583">not</span><span data-p="584">.</span> <span data-p="585">So</span> <span data-p="586">when</span> <span data-p="587">you</span> <span data-p="588">go</span> <span data-p="589">for</span> <span data-p="590">a</span> <span data-p="591">job</span> <span data-p="592">interview</span><span data-p="593">,</span> <span data-p="594">how</span> <span data-p="595">long</span> <span data-p="596">do</span> <span data-p="597">you</span> <span data-p="598">have</span> <span data-p="599">on</span> <span data-p="600">average</span> <span data-p="601">to</span> <span data-p="602">make</span> <span data-p="603">a</span> <span data-p="604">good</span> <span data-p="605">enough</span> <span data-p="606">impression</span> <span data-p="607">for</span> <span data-p="608">an</span> <span data-p="609">employer</span> <span data-p="610">to</span> <span data-p="611">hire</span> <span data-p="612">you</span><span data-p="613">?</span> <span data-p="614">Do</span> <span data-p="615">you</span> <span data-p="616">have</span> <span data-p="617">a</span> <span data-p="618">lesson</span> <span data-p="619">that's</span> <span data-p="620">three</span> <span data-p="621">minutes</span><span data-p="622">,</span> <span data-p="623">less</span> <span data-p="624">than</span> <span data-p="625">five</span> <span data-p="626">minutes</span> <span data-p="627">,</span> <span data-p="628">or</span> <span data-p="629">less</span> <span data-p="630">than</span> <span data-p="631">10</span> <span data-p="632">minutes</span><span data-p="633">?</span> <span data-p="634">Well</span> <span data-p="635">,</span> <span data-p="636">I</span> <span data-p="637">think</span> <span data-p="638">it's</span> <span data-p="639">probably</span> <span data-p="640">quite</span> <span data-p="641">short</span><span data-p="642">,</span> <span data-p="643">so</span> <span data-p="644">I'm</span> <span data-p="645">going</span> <span data-p="646">to</span> <span data-p="647">go</span> <span data-p="648">for</span> <span data-p="649">five</span> <span data-p="650">minutes</span><span data-p="651">.</span> <span data-p="652">Well</span><span data-p="653">,</span> <span data-p="654">you'll</span> <span data-p="655">have</span> <span data-p="656">the</span> <span data-p="657">correct</span> <span data-p="658">answer</span><span data-p="659">,</span> <span data-p="660">the</span> <span data-p="661">result</span> <span data-p="662">of</span> <span data-p="663">this</span> <span data-p="664">survey</span><span data-p="665">,</span> <span data-p="666">at</span> <span data-p="667">the</span> <span data-p="668">end</span> <span data-p="669">of</span> <span data-p="670">the</span> <span data-p="671">program</span><span data-p="672">.</span> <span data-p="673">But</span> <span data-p="674">people</span> <span data-p="675">have</span> <span data-p="676">done</span> <span data-p="677">all</span> <span data-p="678">sorts</span> <span data-p="679">of</span> <span data-p="680">unusual</span> <span data-p="681">things</span> <span data-p="682">to</span> <span data-p="683">reach</span> <span data-p="684">the</span> <span data-p="685">interview</span> <span data-p="686">level</span> <span data-p="687">.</span> <span data-p="688">One</span> <span data-p="689">of</span> <span data-p="690">them</span> <span data-p="691">is</span> <span data-p="692">Britain</span> - <span data-p="693">Daniel</span> <span data-p="694">Conway</span> <span data-p="695">,</span> <span data-p="696">who</span> <span data-p="697">went</span> <span data-p="698">from</span> <span data-p="699">posing</span> <span data-p="700">shirtless</span> <span data-p="701">in</span> <span data-p="702">the</span> <span data-p="703">street</span> <span data-p="704">with</span> <span data-p="705">the</span> <span data-p="706">phrase</span> <span data-p="707">"</span><span data-p="708">employ</span> <span data-p="709">me</span><span data-p="710">"</span> <span data-p="711">written</span> <span data-p="712">on</span> <span data-p="713">his</span> <span data-p="714">chest</span> <span data-p="715">to</span> <span data-p="716">uploading</span> <span data-p="717">a</span> <span data-p="718">video</span> <span data-p="719">on</span> <span data-p="720">social</span> <span data-p="721">media</span> <span data-p="722">asking</span> <span data-p="723">to</span> <span data-p="724">be</span> <span data-p="725">hired</span> <span data-p="726">.</span> <span data-p="727">written</span> <span data-p="728">on</span> <span data-p="729">his</span> <span data-p="730">chest</span> <span data-p="731">to</span> <span data-p="732">upload</span> <span data-p="733">a</span> <span data-p="734">video</span> <span data-p="735">on</span> <span data-p="736">social</span> <span data-p="737">media</span> <span data-p="738">asking</span> <span data-p="739">to</span> <span data-p="740">be</span> <span data-p="741">hired</span> <span data-p="742">.</span> <span data-p="743">Ah</span><span data-p="744">,</span> <span data-p="745">this</span> <span data-p="746">video</span> <span data-p="747">went</span> <span data-p="748">viral</span><span data-p="749">.</span> <span data-p="750" style="">Ah</span><span data-p="751">,</span> <span data-p="752">this</span> <span data-p="753">video</span> <span data-p="754">went</span> <span data-p="755">viral</span> <span data-p="756">.</span> <span data-p="757">It</span> <span data-p="758">means</span> <span data-p="759">became</span> <span data-p="760">popular</span> <span data-p="761">very</span> <span data-p="762">quickly</span> <span data-p="763">.</span> <span data-p="764">quickly</span> <span data-p="765">.</span> <span data-p="766">In</span> <span data-p="767">it</span><span data-p="768">,</span> <span data-p="769">his</span> <span data-p="770">daughter</span> <span data-p="771">appears</span> <span data-p="772">next</span> <span data-p="773">to</span> <span data-p="774">the</span> <span data-p="775">phrase</span><span data-p="776">,</span> <span data-p="777">"</span><span data-p="778">Give</span> <span data-p="779">my</span> <span data-p="780">dad</span> <span data-p="781">a</span> <span data-p="782">job</span> <span data-p="783">.</span><span data-p="784">"</span> <span data-p="785">He</span> <span data-p="786">asks</span> <span data-p="787">,</span> <span data-p="788">"</span><span data-p="789">Donald</span> <span data-p="790">Conway</span> <span data-p="791">tells</span> <span data-p="792">us</span> <span data-p="793">about</span> <span data-p="794">his</span> <span data-p="795">experience</span> <span data-p="796">looking</span> <span data-p="797">for</span> <span data-p="798">work</span><span data-p="799">.</span><br><span data-p="800">he</span> <span data-p="801">wanted</span> <span data-p="802">to</span> <span data-p="803">be</span> <span data-p="804">noticed</span><span data-p="805">?</span><span data-p="806">"</span> <span data-p="807">What</span> <span data-p="808">word</span> <span data-p="809">does</span> <span data-p="810">he</span> <span data-p="811">use</span> <span data-p="812">when</span> <span data-p="813">he</span> <span data-p="814">says</span> <span data-p="815">he</span> <span data-p="816">wanted</span> <span data-p="817">to</span> <span data-p="818">be</span> <span data-p="819">noticed</span><span data-p="820">?</span><span data-p="821">"</span> <span data-p="822">"</span> <span data-p="823">I</span> <span data-p="824">just</span> <span data-p="825">thought</span> <span data-p="826">as</span> <span data-p="827">a</span> <span data-p="828">young</span> <span data-p="829">guy</span> <span data-p="830">of</span> <span data-p="831">kid</span> <span data-p="832">that</span> <span data-p="833">I</span> <span data-p="834">was</span> <span data-p="835">kind</span> <span data-p="836">of</span> <span data-p="837">walking</span> <span data-p="838">to</span> <span data-p="839">a</span> <span data-p="840">job</span><span data-p="841">,</span> <span data-p="842">but</span> <span data-p="843">the</span> <span data-p="844">truth</span> <span data-p="845">is</span><span data-p="846">,</span> <span data-p="847">you</span> <span data-p="848">know</span><span data-p="849">,</span> <span data-p="850">there</span> <span data-p="851">are</span> <span data-p="852">a</span> <span data-p="853">lot</span> <span data-p="854">of</span> <span data-p="855">good</span> <span data-p="856">people</span> <span data-p="857">out</span> <span data-p="858">there</span><span data-p="859">,</span> <span data-p="860">like</span> <span data-p="861">just</span> <span data-p="862">as</span> <span data-p="863">great</span> <span data-p="864">skills</span><span data-p="865">,</span> <span data-p="866">and</span> <span data-p="867">I</span> <span data-p="868">realize</span> <span data-p="869">at</span> <span data-p="870">that</span> <span data-p="871">point</span> <span data-p="872">you've</span> <span data-p="873">got</span> <span data-p="874">to</span> <span data-p="875" style="">stand</span> <span data-p="876">out</span> <span data-p="877">and</span> <span data-p="878">get</span> <span data-p="879">your</span> <span data-p="880">strengths</span> <span data-p="881">across</span> <span data-p="882">.</span><span data-p="883">"</span> <span data-p="884">"</span> <span data-p="885">I</span> <span data-p="886">thought</span> <span data-p="887">when</span> <span data-p="888">I</span> <span data-p="889">was</span> <span data-p="890">young</span> <span data-p="891">that</span> <span data-p="892">I</span> <span data-p="893">was</span> <span data-p="894">walking</span> <span data-p="895">to</span> <span data-p="896">a</span> <span data-p="897">job</span><span data-p="898">,</span> <span data-p="899">but</span> <span data-p="900">the</span> <span data-p="901">truth</span> <span data-p="902">is</span> <span data-p="903">There</span> <span data-p="904">are</span> <span data-p="905">a</span> <span data-p="906">lot</span> <span data-p="907">of</span> <span data-p="908">good</span> <span data-p="909">people</span> <span data-p="910">out</span> <span data-p="911">there</span><span data-p="912">,</span> <span data-p="913">with</span> <span data-p="914">great</span> <span data-p="915">skills</span><span data-p="916">,</span> <span data-p="917">and</span> <span data-p="918">I</span> <span data-p="919">realized</span> <span data-p="920">at</span> <span data-p="921">that</span> <span data-p="922">moment</span> <span data-p="923">that</span> <span data-p="924">you</span> <span data-p="925">have</span> <span data-p="926">to</span> <span data-p="927">stand</span> <span data-p="928">out</span> <span data-p="929">and</span> <span data-p="930">convey</span> <span data-p="931">your</span> <span data-p="932">strengths</span><span data-p="933">.</span><span data-p="934">"</span><br><span data-p="935">He</span> <span data-p="936">used</span> <span data-p="937">the</span> <span data-p="938" style="">phrasal</span> <span data-p="939">verb</span> <span data-p="940">"</span><span data-p="941">to</span> <span data-p="942">stand</span> <span data-p="943">out</span><span data-p="944">.</span><span data-p="945">"</span> <span data-p="946">It</span> <span data-p="947">means</span> <span data-p="948">to</span> <span data-p="949">be</span> <span data-p="950">more</span> <span data-p="951">visible</span> <span data-p="952">than</span> <span data-p="953">others</span> <span data-p="954">in</span> <span data-p="955">a</span> <span data-p="956">group</span> <span data-p="957">so</span> <span data-p="958">that</span> <span data-p="959">he</span> <span data-p="960">can</span> <span data-p="961">be</span> <span data-p="962">noticed</span><span data-p="963">.</span><br> <span data-p="964">Dan</span> <span data-p="965">Conway</span> <span data-p="966">uses</span> <span data-p="967">another</span> <span data-p="968">phrasal</span> <span data-p="969" style="">verb</span> <span data-p="970">,</span> <span data-p="971">"</span><span data-p="972">get</span> <span data-p="973">your</span> <span data-p="974">strengths</span> <span data-p="975">across</span><span data-p="976">,</span><span data-p="977">"</span> <span data-p="978">to</span> <span data-p="979">get</span> <span data-p="980">something</span> <span data-p="981">across</span> <span data-p="982">means</span> <span data-p="983">to</span> <span data-p="984">make</span> <span data-p="985" style="">something</span> <span data-p="986">clear</span> <span data-p="987">.</span> <span data-p="988">In</span> <span data-p="989">this</span> <span data-p="990">case</span><span data-p="991">,</span> <span data-p="992">he</span> <span data-p="993" style="">wants</span> <span data-p="994">the</span> <span data-p="995">employer</span> <span data-p="996">to</span> <span data-p="997" style="">understand</span> <span data-p="998">how</span> <span data-p="999" style="">good</span> <span data-p="1000" style="">he</span> </p></div>
      </div>
      <div id="footer">

        <span class="pageControls">
          <button class="continueButton" title="Continue" id="continueButtonRTL" style="display: none;">
            Continue
          </button>
          <button class="pageControlButton" title="Previous Page" id="prevPageButton" style="visibility: visible;"><i class="icon-caret-left icon-2x"></i></button>

          <span class="spacer"></span>

          <span class="pageNumberContainer">
            <span id="pageNumber">0%</span>
            <div class="pageNavigationTooltip tooltip arrowBottom">
              <h4>Location <span id="location">0</span> / <span id="totalLocations">1,854</span></h4>
              <ul class="pageNavigationOptions">
                <li id="pageNavigationStart">Go to start</li>
                <li id="pageNavigationFurthest">Go to furthest read location</li>
                <li id="pageNavigationSpecific">Go to specific location...</li>
              </ul>
            </div>
          </span>

          <span class="spacer readAloudSpacer"></span>
          <button class="skipBackward button" title="Skip Backward">
            <i class="icon-rotate-left"></i>
          </button>
          <span class="readAloudButtonContainer" style="display: inline;">
            <button id="readAloudButton" class="button"><svg class="icon" width="148" height="148" viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M74 148C114.869 148 148 114.869 148 74C148 33.1309 114.869 0 74 0C33.1309 0 0 33.1309 0 74C0 114.869 33.1309 148 74 148ZM55 113.837L118 77.4641C120.667 75.9245 120.667 72.0755 118 70.5359L55 34.1628C52.3335 32.6232 49 34.5477 49 37.6269V110.373C49 113.452 52.3335 115.377 55 113.837Z" fill="currentColor"></path></svg></button>
            <div class="playAudioTooltip tooltip arrowBottom">
              <p>Click here to play the attached mp3 audio file</p>
            </div>
          </span>
          <button class="skipForward" title="Skip Forward">
            <i class="icon-rotate-right"></i>
          </button>

          <span class="spacer"></span>

          <button class="pageControlButton" title="Next Page" id="nextPageButton" style="visibility: visible;">
            <i class="icon-caret-right icon-2x"></i>
          </button>
          <button class="continueButton" title="Continue" id="continueButton" style="display: none;">
            Continue
          </button>
        </span>
      </div>
      <div id="next" title="Next page" style="right: -63px;">
        <div class="arrowRight"><!--<i class="icon-caret-right"></i>--></div>
      </div>
      <div id="prev" title="Previous page" class="" style="left: -63px;">
        <div class="arrowLeft"><!--<i class="icon-caret-left"></i>--></div>
      </div>
    </div>
  </div>
</div>
<div class="sideBar">
  <div class="titleBar">
    <div class="tabHeader selected" data-tab="smartDictionary" title="Context-Aware Explanation">
      Explain
    </div>
    <div class="tabHeader " data-tab="dictionary" title="Dictionary Definitions">
      Dictionary
    </div>
    <div class="tabHeader" data-tab="formattingOptions" title="Formatting Options">
      A<small>A</small>
    </div>
    <div class="tabHeader " data-tab="editWord" title="Translated Words and Phrases">
      Words
    </div>
    <div class="tabHeader" data-tab="edit" title="Edit">
      Edit
    </div>
    <div class="tabHeader" data-tab="youTube" title="YouTube">
      YouTube
    </div>
    <div class="tabHeaderSpacer"></div>
  </div>
  <div class="tabContent selected" data-tab="smartDictionary">
    <div id="smartDictionaryContainer">
    </div>
  </div>
  <div class="tabContent" data-tab="dictionary">
    <div id="dictionaryChoice">
      <span id="fromLanguage" class="languageSelectView"></span>
      <span class="translationDirectionArrowView fadedHoverButton"></span>
      <span id="toLanguage" class="languageSelectView"></span>
      <button id="openDictionary" style="display:none" class="noMobile">Open in new window</button>
    </div>
    <div id="fallback" style="display: none;"></div>
    <div id="dictionaryContainer" style="height: 216px;">
    <p>Click any word on the left to translate it.</p>
    </div>
  </div>
  <div class="tabContent" data-tab="formattingOptions">
  <div id="formattingOptions"><h3>Change Size</h3><p><span class="clickable">- Font</span><span class="clickable">+ Font</span></p><p><span class="clickable">- Line Height</span><span class="clickable">+ Line Height</span></p><p class="noMobile"><span class="clickable"><i class="icon-arrow-right"></i> Column <i class="icon-arrow-left"></i></span><span class="clickable"><i class="icon-arrow-left"></i> Column <i class="icon-arrow-right"></i></span></p><h3>Change Appearance</h3><p><span class="clickable fontOption" style="">Helvetica</span><span class="clickable fontOption selected" style="">Open Sans</span><span class="clickable fontOption" style="">Times New Roman</span><span class="clickable fontOption" style="">Jost</span></p><p><span class="clickable">E-Ink</span><span class="clickable selected">Light</span><span class="clickable">Dark</span></p><p class=""><span class="clickable selected" style=""><i class="icon-align-left"></i> &nbsp; Align Left</span><span class="clickable" style=""><i class="icon-align-justify"></i> &nbsp; Justify</span></p><p class=""><span class="clickable selected" style="">No Sentence Breaks</span><span class="clickable" style="">Sentence Breaks</span></p><h3>Translation Behavior</h3><p class=""><span class="clickable selected" style="width: fit-content;">Translations On</span><span class="clickable" style="width: fit-content;"><span class="noMobile">Translations </span>Off <small>(monolingual)</small></span></p><p><span class="clickable selected">Basic Translations</span><span class="clickable">Context Aware <small>(better)</small></span></p><p class=""><span class="clickable selected" style="">Highlight</span><span class="clickable" style="">Underline</span><span class="clickable" style="">Replace</span></p><p class=""><span class="clickable" title="Adjacent words will be translated separately. Drag across words manually to translate phrases." style="">Don't Merge</span><span class="clickable selected" title="Selecting two adjacent words will combine them into a phrase." style="">Merge Phrases</span></p><h3>On Deselect Word/Phrase</h3><p class=""><span class="clickable selected" style="">Delete Flashcard</span><span class="clickable" style="">Keep Flashcard</span></p><h3>Review Summary Buttons</h3><p class=""><span class="clickable" style="">Show</span><span class="clickable" style="">Hide</span></p><div class="autoHighlightOptions"><h3>Auto-Highlight Words</h3><p class=""><span class="clickable selected" style="width: fit-content;">None</span><span class="clickable" style="width: fit-content;">Ready To Learn</span><span class="clickable" style="width: fit-content;">All Your Words</span></p></div><h3 class="streakOptions">Show Streak In Topbar</h3><p class="column"><span class="clickable selected" style="">Always Show</span><span class="clickable" style="">Show Until Complete</span><span class="clickable" style="">Never Show</span></p><div class="readAloudVoiceSetting"><h3 class="readAloudVoice">Read Aloud Voice</h3><small>Exact voices available depends on your device and browser. Some voices might not support highlighting of every word spoken.</small><ul class="readAloudVoice"><li><span class="clickable readAloudVoiceOption">Google UK English Female</span></li><li><span class="clickable readAloudVoiceOption">Google UK English Male</span></li><li><span class="clickable readAloudVoiceOption">Google US English</span></li></ul></div><div class="readAloudRateSetting"><h3 class="readAloudRateHeading">Read Aloud Speed</h3><p class="readAloudRate"><span class="clickable readAloudRateOption" data-value="0.6">0.6X</span><span class="clickable readAloudRateOption" data-value="0.8">0.8X</span><span class="clickable readAloudRateOption" data-value="0.9">0.9X</span><span class="clickable readAloudRateOption selected" data-value="1">1X</span><span class="clickable readAloudRateOption" data-value="1.2">1.2X</span><span class="clickable readAloudRateOption" data-value="1.5">1.5X</span></p></div><p style="margin-top: 24px;"><small><a target="_blank" href="https://forum.readlang.com/t/guide-to-the-options-in-the-reader-page-aa-tab/1294">Learn about all the above options</a></small></p></div></div>
  <div class="tabContent" data-tab="editWord"><div class="wordsToolbar"><div class="wordListControls">
  <div class="checkboxCell selectAllContainer toolbarButton">
    <input type="checkbox" class="selectAll" id="selectAllCheckbox">
    <label for="selectAllCheckbox">
      <i class="icon-check"></i>
      <i class="icon-check-empty"></i>
      <i class="icon-check-minus"></i>
    </label>
  </div>
  <span class="actions dropdown"><span class="actions dropdown">
  <button class="dropdownButton prominent" disabled="">Actions &nbsp; <small>▼</small></button>
  <div class="dropdownButtonList">
    <h3>Perform action</h3>
    <ul style="margin-bottom:0">
        <li class="clickable selectOption" data-action="delete">Delete</li>
        <li class="clickable selectOption" data-action="undelete">Un-Delete</li>
        <li class="clickable selectOption" data-action="permDelete">Permanently Delete</li>
        <li class="clickable selectOption" data-action="export">Export</li>
        <li class="clickable selectOption" data-action="flashcards">Practice Flashcards</li>
    </ul>
  </div>
</span>

</span>
  <div class="spacer"></div>
  <label class="sortByLabel customSelectLabel">
    <select class="customSelect sortBySelector toolbarButton"><option data-value="lastModified" selected="">Recently Modified</option><option data-value="lastPracticed">Recently Practiced</option><option data-value="new">Recently Added</option><option data-value="old">Oldest</option><option data-value="frequency">Usefulness / Frequency</option><option data-value="relevancy">Relevancy</option></select>
    <i class="icon icon-sort"></i>
  </label>
  <div class="paginationControls"><div style="text-align:right">
</div>

</div>
</div>

<div class="wordListNotification selectWholeGroup">
</div>
<div class="wordListNotification undoDelete">
</div>

</div><div><table class="wordTable">
  <colgroup>
    <col class="columnSelectCheckbox">
    <col class="columnTTS">
    <col class="columnFavorite">
    <col class="columnWord">
    <col class="columnTranslation">
  </colgroup>
  <tbody>
    <tr class="clickable wordRow" data-userwordid="69063837f2ed93754be2f3d9">
      <td style="padding:0 0 0 2px">
        <div class="checkboxCell">
          <input type="checkbox" data-userwordid="69063837f2ed93754be2f3d9" id="checkbox-69063837f2ed93754be2f3d9">
          <label class="checkboxLabel" for="checkbox-69063837f2ed93754be2f3d9">
            <i class="icon-check"></i>
            <i class="icon-check-empty"></i>
            <i class="icon-check-minus"></i>
          </label>
        </div>
      </td>
      <td style="height:29px">
        <i title="Pronounce" class="icon-volume-down audioButton needsclick"></i>
      </td>
      <td>
        <span title="Favorite" class="favorite"></span>
      </td>
      <td class="wordColumn" id="word-69063837f2ed93754be2f3d9">
      Listen to <strong>what</strong> she says and tell me what is…
            
      </td>
      <td id="translation-69063837f2ed93754be2f3d9" class="translationColumn">qué</td>
      <td id="source-69063837f2ed93754be2f3d9" class="rightPadding noPhablet">
      </td>
    </tr>
  </tbody>
</table></div></div>
  <div class="tabContent" data-tab="edit">
    <div id="editDocumentFieldset">
    </div>
  </div>
  <div class="tabContent" data-tab="youTube">

    <h3>Synchronized YouTube Video</h3>
    <p>
    Paste YouTube Video URL here: <input type="text" id="youTubeID" value="" style="margin-bottom:3px">
    <button id="saveYouTubeID"><i class="icon-plus"></i> Add YouTube Video</button>
    </p>

  </div>
</div>
</div>
</div>
    <noscript>
      <div style="
        z-index:100;
        position:fixed;
        margin:auto;
        left:0;
        right:0;
        top:80px;
        text-align:center;
        color:black;
        background-color:#369E7A;
        padding:30px;
        ">
        <p style="max-width:500px;margin:20px auto">
          Enable javascript in your browser to use Readlang
        </p>
        <p style="max-width:500px;margin:20px auto">
          Readlang needs javascript to provide in-line translations, interactive flashcards, and many more features that help you learn a foreign language.
        </p>
      </div>
    </noscript>
  

<div id="readlang-extension-installed"></div></body>