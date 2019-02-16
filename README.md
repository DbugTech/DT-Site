# Dbug Tech Official website - (source)

![https://www.travis-ci.org/DbugTech/DT-Ofiicial-Website.svg?branch=master](https://www.travis-ci.org/DbugTech/DT-Ofiicial-Website.svg?branch=master)

generated site code hosted at [https://github.com/DbugTech/dbugtech.github.io](https://github.com/DbugTech/dbugtech.github.io)

# Contrinution guide
in order to update the site you need to send a (PR) of the version of the site you want

## how to edit the site on your local machine

- in the src folder is where you'll perform any edits
- after cloning for the first time in this root folder of the repo run the following

```bash
$ npm install
...
added 76 packages from 109 contributors and audited 20756 packages in 236.433s
found 7 vulnerabilities (6 moderate, 1 high)
  run `npm audit fix` to fix them, or `npm audit` for details
```

- after installation is complete you can run dev preview with

```bash
$ gulp watch
...
[Browsersync] Access URLs:
 -------------------------------------
       Local: http://localhost:3000
    External: http://192.168.56.1:3000
 -------------------------------------
          UI: http://localhost:3001
 UI External: http://localhost:3001
 -------------------------------------
[Browsersync] Serving files from: app/tmp/
```

## how to use

in the repo the `src` folder contains the files that will be compiled to create the final site.

### partials

partials are reusable snippets of html of the site that you can import to any html file in the src folder

partials are contained in the `src/partials` folder

to import a partial into a page, you import it using html comments in the following format

```html
<!-- partial:<LOCATION_OF_THE_PARTIAL_FILE-->
<!-- CALL_THE_PARTIAL -->
```

let's say to add the `partials/_head.html` partial file to `home.html` for example you would add the following at the top of the `home.html` file

```html
<!-- partial:partials/_head.html -->
<!-- partial -->
```