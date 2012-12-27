<@markup id="documentlibrary-upload-fileio" target="js" action="after" scope="global">
   <!--FILEPICKER-->
   <@script src="${url.context}/res/upload-filepicker-io.js"/>
   <@script src="http://api.filepicker.io/v1/filepicker.js" />
   <@inlineScript>
      filepicker.setKey("");
   </@>
</@markup>