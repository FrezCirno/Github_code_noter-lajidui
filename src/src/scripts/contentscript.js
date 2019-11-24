console.log("contentscript.js")


function init() {
    localStorage.clear();
    var lines = document.querySelectorAll("tr");
    for (var i = 0; i < lines.length; i++) {
        var button = document.createElement("button");
        button.className = "show-note";
        button.innerText = "...";
        button.classList.add("btn");
        button.classList.add("btn-sm");
        button.onclick = showNote;
        lines[i].appendChild(button);

        var button = document.createElement("button");
        button.className = "show-note";
        button.innerText = "+";
        button.classList.add("btn");
        button.classList.add("btn-sm");
        button.onclick = addNote;
        lines[i].appendChild(button);
    }
}

function parseURL(url) {
    return url.split("#")[0].slice(19).split("/");
}

function queryNote(path, line_number) {
    var url = path.split('#')[0];
    console.log(url)
    console.log(localStorage.getItem(url));
    var allnote = JSON.parse(localStorage.getItem(url));
    return allnote;
}

function showNote(ev) {
    var button = ev.srcElement;
    var tr = button.parentNode;

    var line_number = parseInt(tr.children[0].attributes['data-line-number'].nodeValue);
    var allnote = queryNote(document.URL, line_number);

    for (note of allnote) {
        if (line_number >= note.start_line && line_number <= note.end_line) {
            var code_tr = document.getElementById("L" + note.end_line).parentNode;
            var note_tr = document.createElement('tr');
            note_tr.className = "note-tr";

            var td = document.createElement('td');
            td.innerText = note.start_line + "-" + note.end_line;
            td.classList.add("blob-num");
            //td.classList.add("note-line-num");
            note_tr.appendChild(td);

            if (document.getElementsByClassName())
                var td = document.createElement("td");
            td.innerText = "        // " + note.content + "      -- " + note.user;
            td.classList.add("pl-c");
            td.classList.add("blob-code");
            td.classList.add("note-class");
            td.onclick = () => {
                console.log("highlighting");
                var l_start = parseInt(note.start_line);
                var l_end = parseInt(note.end_line);
                for (var line = l_start; line <= l_end; line++) {
                    var code_tr = document.getElementById("L" + line).parentNode;
                    code_tr.getElementsByTagName('td')[1].classList.add("highlighted");
                }
            };
            note_tr.appendChild(td);

            var button = document.createElement('button');
            button.innerText = "+1";
            button.classList.add("btn");
            button.classList.add("btn-sm");
            button.onclick = like;
            note_tr.appendChild(button);

            var button = document.createElement('button');
            button.className = "show-note";
            button.innerText = "x";
            button.classList.add("btn");
            button.classList.add("btn-sm");
            button.onclick = (ev) => ev.srcElement.parentNode.remove();
            note_tr.appendChild(button);

            code_tr.parentNode.insertBefore(note_tr, code_tr.nextElementSibling);
        }
    }
    // button.remove();
}
function like(ev) {
    var button = ev.srcElement;
    var tr = button.parentNode;
    console.log("暂时未完成");
}

function addNote(ev) {
    var button = ev.srcElement;
    var tr = button.parentNode;
    var tbody = tr.parentNode;
    //button.remove();

    var input_tr = document.createElement('tr');
    input_tr.className = "input-tr";

    var td = document.createElement('td');
    var textBox = document.createElement('input');
    textBox.className = "start-line-box";
    // textBox.style = "width:1%";
    textBox.classList.add("blob-num");
    d_start = document.getElementsByClassName("highlighted")[0].id.slice(2);
    d_end = tr.getElementsByTagName('td')[0].dataset.lineNumber;
    textBox.value = d_start + "-" + d_end;
    td.appendChild(textBox);
    input_tr.appendChild(td);

    var td = document.createElement('td');
    var textBox = document.createElement('input');
    // textBox.innerText = "在此输入代码注释";
    textBox.className = "note-box";
    td.appendChild(textBox);
    input_tr.appendChild(td);

    var td = document.createElement('td');
    var button = document.createElement('button');
    button.innerText = "提交";
    button.classList.add("btn");
    button.classList.add("btn-sm");
    button.onclick = submitNote;
    td.appendChild(button);
    input_tr.appendChild(td);

    var td = document.createElement('td');
    var button = document.createElement('button');
    button.className = "show-note";
    button.innerText = "取消";
    button.classList.add("btn");
    button.classList.add("btn-sm");
    button.onclick = (ev) => ev.srcElement.parentNode.remove();
    td.appendChild(button);
    input_tr.appendChild(td);

    tbody.insertBefore(input_tr, tr.nextElementSibling);
}

function submitNote(ev) {
    var button = ev.srcElement;
    var input_tr = button.parentNode.parentNode;
    var note_box = input_tr.getElementsByClassName('note-box')[0];
    var note = note_box.value;
    var start_line_box = input_tr.getElementsByClassName('start-line-box')[0];
    var start_line_box_value = start_line_box.value.split('-');
    var start_line = start_line_box_value[0];
    var end_line = start_line_box_value[1];
    var obj = {
        start_line: start_line,
        end_line: end_line,
        content: note,
        user: document.head.children['user-login'].content
    };

    var key = input_tr.baseURI.split('#')[0];
    var old = localStorage.getItem(key);
    if (old != null) {
        var newnote = JSON.parse(old);
        newnote.push(obj);
    }
    else
        var newnote = [obj];
    localStorage.setItem(key, JSON.stringify(newnote));

    input_tr.remove();
    console.log(input_tr.previousSibling);
    input_tr.previousElementSibling.lastChild.previousElementSibling.click();
}



document.addEventListener('DOMContentLoaded', init);
