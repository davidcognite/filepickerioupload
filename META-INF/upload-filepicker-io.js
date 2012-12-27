/*

Filepicker.io Extension to file-upload.js

*/

(function()
{
   Alfresco.FileUpload.prototype.defaultShow = (function() {
      // Copying show method before overwriting it.
      return Alfresco.FileUpload.prototype.show;
   })();
   YAHOO.lang.augmentObject(Alfresco.FileUpload.prototype,
   {
      show: function FU_filepicker_show(config)
      {
         // if using filePicker.io
         if (this.filePickerEnabled())
         {
            this.showFilePicker(config);
         } else {
            this.defaultShow(config);
         }
      },
      showFilePicker: function FU_filepicker_showFilePicker(config)
      {
         // File picker stuff goes here
         if (window.filepicker) {
             filepicker.pick({services: ['ALFRESCO','BOX','DROPBOX','GOOGLE_DRIVE','COMPUTER','GMAIL']}, function(fpfile){
                 filepicker.read(fpfile, function(data){
                     var multipartform = '';
                     var boundary = "098ckljwe908";

                     multipartform += '------WebKitFormBoundary'+boundary;
                     multipartform += '\r\n';
                     multipartform += 'Content-Disposition: form-data; name="filedata"; filename="'+fpfile.filename+'"';
                     multipartform += '\r\n';
                     multipartform += 'Content-Type: '+fpfile.mimetype;
                     multipartform += '\r\n\r\n';
                     multipartform += data;
                     multipartform += '\r\n';

                     var params = {};
                     params.filename = fpfile.filename;
                     params.destination = "";
                     params.siteId = Alfresco.constants.SITE;
                     params.containerId = config.containerId;
                     params.uploadDirectory = config.uploadDirectory;
                     params.majorVersion = false;
                     params.username = "";
                     params.overwrite = false;
                     params.thumbnails = "doclib";

                     for (var key in params) {
                         multipartform += '------WebKitFormBoundary'+boundary;
                         multipartform += '\r\n';
                         multipartform += 'Content-Disposition: form-data; name="'+key+'"';
                         multipartform += '\r\n\r\n';
                         multipartform += params[key];
                         multipartform += '\r\n';
                     };  
                     multipartform += '------WebKitFormBoundary'+boundary+"--";;
                     
                     Alfresco.util.Ajax.request({
                         method: "POST",
                         url: Alfresco.constants.PROXY_URI + "api/upload",
                         dataStr: multipartform,
                         requestContentType: "multipart/form-data; boundary=----WebKitFormBoundary"+boundary,
                         responseContentType: "JSON",
                         successCallback: {fn: function(resp){
                             YAHOO.Bubbling.fire("metadataRefresh");
                             console.log(resp);
                         }}  
                     }); 
                 }); 
             }); 
             //Some style tweaks
             document.getElementById("filepicker_dialog_container").style.top = "200px";
             document.getElementById("filepicker_dialog_container").style.overflow = "hidden";
             return;
         }
      },
      filePickerEnabled: function FU_filepicker_filePickerEnabled()
      {
         // Logic for checking filepicker is reachable, and config is enabled goes here.
         return window.filepicker;
      }
   }, true);
})();