<script>
  import {
    JSZip,
    saveAs,
    dataControllerPhp,
    dataEmptyPhp,
    dataEmptyXml,
    dataViewHtmlPhp,
    dataMetadataXml,
    dataDefaultXml,
    dataDefaultPhp
  } from "./data";
  export let name;
  export let buttonEnabled = false;
  export let componentName = "Empty";

  const reserved = [
    "ajax",
    "banners",
    "config",
    "contact",
    "content",
    "contenthistory",
    "fields",
    "finder",
    "mailto",
    "media",
    "menus",
    "modules",
    "newsfeeds",
    "privacy",
    "search",
    "tags",
    "users",
    "wrapper"
  ];

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
  }

  function alpha_numeric_filter(string) {
    const alpha_numeric = Array.from(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    );
    const json_string = JSON.stringify(string);
    let filterd_string = "";

    for (let i = 0; i < json_string.length; i++) {
      let char = json_string[i];
      let index = alpha_numeric.indexOf(char);
      if (index > -1) {
        filterd_string += alpha_numeric[index];
      }
    }

    return filterd_string;
  }

  function removeFirstNum(str) {
    while (
      [1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(parseInt(str.charAt(0))) > -1 ||
      "0" === str.charAt(0)
    ) {
      str = str.substr(1);
    }

    return str;
  }

  function checkValidity(name) {
    let valid = true;
    reserved.forEach(val => {
      if (val === name.toLowerCase()) {
        return (valid = false);
      }
    });

    return valid;
  }

  function generateZip(ev) {
    const zip = new JSZip();
    const div = ev.target.parentNode.parentNode;
    const componentName = div.getAttribute("data-component");

    let controllerPhp = replaceAll(
      dataControllerPhp,
      "{{componentName}}",
      componentName
    );
    controllerPhp = replaceAll(
      controllerPhp,
      "{{componentNameLowercase}}",
      componentName.toLowerCase()
    );
    zip.file("controller.php", controllerPhp);

    let emptyXml = replaceAll(dataEmptyXml, "{{componentName}}", componentName);
    emptyXml = replaceAll(
      emptyXml,
      "{{componentNameLowercase}}",
      componentName.toLowerCase()
    );
    zip.file(`${componentName.toLowerCase()}.xml`, emptyXml);

    let emptyPhp = replaceAll(dataEmptyPhp, "{{componentName}}", componentName);
    emptyPhp = replaceAll(
      emptyPhp,
      "{{componentNameLowercase}}",
      componentName.toLowerCase()
    );
    zip.file(`${componentName.toLowerCase()}.php`, emptyPhp);

    const views = zip.folder("views");
    const defaultF = views.folder("default");

    let viewHtmlPhp = replaceAll(
      dataViewHtmlPhp,
      "{{componentName}}",
      componentName
    );
    viewHtmlPhp = replaceAll(
      viewHtmlPhp,
      "{{componentNameLowercase}}",
      componentName.toLowerCase()
    );
    defaultF.file("view.html.php", viewHtmlPhp);

    let metadataXml = replaceAll(
      dataMetadataXml,
      "{{componentName}}",
      componentName
    );
    metadataXml = replaceAll(
      metadataXml,
      "{{componentNameLowercase}}",
      componentName.toLowerCase()
    );
    defaultF.file("metadata.xml", metadataXml);

    const tmpl = defaultF.folder("tmpl");
    let defaultXml = replaceAll(
      dataDefaultXml,
      "{{componentName}}",
      componentName
    );
    defaultXml = replaceAll(
      defaultXml,
      "{{componentNameLowercase}}",
      componentName.toLowerCase()
    );
    tmpl.file("default.xml", defaultXml);

    let defaultPhp = replaceAll(
      dataDefaultPhp,
      "{{componentName}}",
      componentName
    );
    defaultPhp = replaceAll(
      defaultPhp,
      "{{componentNameLowercase}}",
      componentName.toLowerCase()
    );
    tmpl.file("default.php", defaultPhp);

    zip.generateAsync({ type: "blob" }).then(
      blob => {
        saveAs(blob, `com_${componentName.toLowerCase()}.zip`);
      },
      err => {
        this.text(err);
      }
    );
  }

  function onchange(event) {
    event.preventDefault();
    event.stopPropagation();

    let el = event.target;
    let value = el.value;

    value = alpha_numeric_filter(value);
    value = removeFirstNum(value);

    if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
      value = value.replace(value.charAt(0), value.charAt(0).toUpperCase());
    }

    if (checkValidity(value)) {
      componentName = value;
      componentNameLowercase = value.toLowerCase();
      el.value = value;
      buttonEnabled = true;
    } else {
      buttonEnabled = false;
    }

    if (!value) {
      buttonEnabled = false;
    }
  }
</script>

<div class="card" data-component={componentName}>
  <h1 class="h1">Joomla's Landing Page Component Creator</h1>
  <h2>Customise the component</h2>
  <div class="card">
    <label class="form-label" for="the-only-input">Component name</label>
    <input
      class="form-input"
      type="text"
      id="the-only-input"
      value={componentName}
      on:keyup={onchange} />
  </div>
  {#if buttonEnabled}
    <div class="card-footer">
      <button class="build-button" on:click={generateZip} type="button">
        Computer, build me the component...
      </button>
    </div>
  {/if}
</div>
