var Ecmr = (function(){
   // simple specify a -c for the command and -t for the timeout
   //

   var fs = require("fs"), 
    util = require("util"),
    child = require("child_process");

//basicly prepares your commands for proper passing,generates a object
//containing ur command and timout specified  if not it uses 1000 ms
   var prepareOptions = function(){
      var normalized = {
         command: undefined,
         timeout:1000
      };

      var op = arguments[0];
      for(var i=0; i < op.length;i++){
         if(op[i] == "-c" || op[i] == "-command"){
            normalized.command = op[i+1].replace(/\s+/ig,' ');
         }else if(op[i] == "-t" || op[i] == "-timeout"){
            normalized.timeout =  1000*parseInt(op[i+1].replace(/\s+/ig,''));   
         }
      }
      
      return normalized;
   }

// gets the arguments passed and processes them for parsing
   function matchArgs(){
      var args = process.argv;
      var options = prepareOptions(args.splice(2,args.length));

      return {
         node: args[0],
         c_dir: process.cwd(),
         cm_dir: args[1],
         command: options.command,
         timeout: options.timeout
      }
   }

   //code to run commands even with error 
   
   //what will be exposed to the outsie world and 
   //simple generates a child process every interval which prints + or
   //- depending on if there was a error or not ,yes there occurrence of an 
   //error is used to indicate if it succeeded or not 
   function run_command(dir,cmd){
      child.exec(cmd,{cwd:dir},function(e,out,err){
         if(e){
            console.log('\033[31m');
            process.stdout.write(" - ");
         }
            process.stdout.write(" + ");
      });
   }

   
   return {
      exec: function(res){
         var res = res ? res : matchArgs(),scope = this,
         interval= function(res){
            run_command(res.c_dir,res.command);
         };

         var runner = setInterval(function(){
            interval.call(scope,res);
         },res.timeout);
      }
   };

})();

module.exports.Ecmr = Ecmr;
