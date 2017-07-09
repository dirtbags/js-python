var editor;

function outf(text) { 
    var mypre = document.getElementById("stdout"); 
    mypre.textContent = mypre.textContent + text; 
} 

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit() {
    var stdout = document.getElementById("stdout");
    var prog = editor.getValue();

    stdout.textContent = "";
    stdout.classList.remove("error");

    localStorage.setItem("program", prog);

    // This is why people hate JavaScript
    var myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function(mod) {
	// Do something on success
    },
		   function(err) {
		       var e = document.createElement("span");
		       e.textContent = err.toString();
		       e.classList.add("error");
		       stdout.appendChild(e);
		   });
}

function init() {
    var prog = localStorage.getItem("program");

    editor = ace.edit("editor");
//    editor.setTheme("ace/theme/twilight");
    editor.session.setMode("ace/mode/python");

    if (prog) {
	editor.setValue(prog);
	editor.clearSelection();
    }

    Sk.pre = "stdout";
    Sk.configure({output:outf, read:builtinRead});
    if (! Sk.TurtleGraphics) {
        Sk.TurtleGraphics = {};
    }
    Sk.TurtleGraphics.target = document.getElementById("turtlepen");
}

window.addEventListener('load', init);
