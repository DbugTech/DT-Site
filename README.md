# Dbug Tech Official website - (source)

![https://www.travis-ci.org/DbugTech/DT-Ofiicial-Website.svg?branch=master](https://www.travis-ci.org/DbugTech/DT-Ofiicial-Website.svg?branch=master)

generated site code hosted at [https://github.com/DbugTech/dbugtech.github.io](https://github.com/DbugTech/dbugtech.github.io)

## Contribution guide (for team members only)

## how to edit the site on your local machine

- in the `app/src` folder is where you'll perform any edits

- _but before you start editing_

- after cloning for the first time in this root folder of the repo run the following

```bash
$ npm install
...
added 76 packages from 109 contributors and audited 20756 packages in 236.433s
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

in the repo the `app/src` folder contains the files that will be compiled to create the final site.

### partials

partials are reusable snippets of html of the site that you can import to any html file in the src folder

partials are contained in the `app/src/partials` folder

to import a partial into a page, you import it using html comments in the following format

```html
<!-- partial:<LOCATION_OF_THE_PARTIAL_FILE-->
<!-- CALL_THE_PARTIAL -->
```

let's say to add the `app/src/partials/_head.html` partial file to `app/src/home.html` for example you would add the following at the top of the `src/home.html` file

```html
<!-- partial:partials/_head.html -->
<!-- partial -->
```

## Imprtant Note

any file you need to remove from `app/src` please remember to put them in the `app/lib` folder