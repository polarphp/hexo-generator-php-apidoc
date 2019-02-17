"use strict";
/**
 * @author ZZU_SOFTBOY
 */
const Promise = require("bluebird");
const _ = require('lodash');
const fs = require('hexo-fs');
const { execSync,spawn } = require('child_process');

hexo.extend.filter.register("before_generate", function() {
   let get_libpdk_apidoc_saved_dir = hexo.extend.helper.get("get_libpdk_apidoc_saved_dir");
   let get_root_dir = hexo.extend.helper.get("get_root_dir");
   let rootDir = get_root_dir();
   let ideAutoCompleteDir = rootDir+'/pdk-ide-auto-complete';
   let apigenBin = ideAutoCompleteDir + '/vendor/bin/apigen';
   let targetApiDocsDir = get_libpdk_apidoc_saved_dir();
   if (fs.existsSync(targetApiDocsDir)) {
      fs.rmdirSync(targetApiDocsDir);
   }
   return new Promise(function (resovle, reject)
   {
      // Work with the repository object here.
      const ls = spawn('php', [apigenBin, 'generate', '-s', "src", '--destination', targetApiDocsDir], {
         cwd:ideAutoCompleteDir
      });
      ls.stdout.on('data', (data) => {
         hexo.log.info(data.toString().trim());
      });
      ls.on('close', (code) => {
         if (0 !== code) {
            reject("apigen error");
         } else {
            resovle();
         }
      });
   });
}, 1);