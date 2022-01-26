// jshint esversion: 8
let lang = document.querySelector('script[highlight]').getAttribute('highlight');
let rules;
(async function() {
  let getJSON = async p => await fetch(p).then(r=>r.ok?r.json():undefined);
  rules = await getJSON(`https://magnogen.net/IDE/${lang}/rules.json`);
})();

function update(text) {
  let result_element = document.querySelector('code');
  if(text[text.length-1] == '\n') text += ' ';
  
  result_element.textContent = (e=>{
    let p = document.createElement('p');
    p.appendChild(document.createTextNode(text));
    return p.innerHTML;
  })();
  
  if (rules != undefined) csHighlight({ patterns: rules.map(r=>{r.match=new RegExp(r.match);return r}) });
}

function sync_scroll(element) {
  let result_element = document.querySelector('#out');
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}

function check_tab(element, event) {
  let code = element.value;
  if(event.key == 'Tab') {
    event.preventDefault();
    let before_tab = code.slice(0, element.selectionStart);
    let after_tab = code.slice(element.selectionEnd, element.value.length);
    let cursor_pos = element.selectionEnd + 1;
    element.value = before_tab + '\t' + after_tab;
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element.value);
  }
}
