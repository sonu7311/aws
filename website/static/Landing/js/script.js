l = document.getElementsByClassName('list_contents')
for (i=0; i < l.length; i+=1){
    s = l[i].innerHTML
    s = s.substring(1,s.length-1).split(',')
    f = ""
    for (j=0; j<s.length; j+=1) f+= s[j]+'\t\u2022\t';
    if(f.length > 0) f = f.substring(0,f.length-3);
    l[i].innerHTML = f
}
s = document.getElementsByClassName('skillset')
r = '<li>p</li>'
for (i=0; i < s.length; i+=1){
    m = s[i].innerHTML
    m = m.substring(1,m.length-1).split(',')
    f = ""
    for (j=0; j<m.length; j+=1){ 
        if(m[j] == 'line') f+='<hr>';
        else f+=r.replace(/p/,m[j]);
    }
    s[i].innerHTML = f
}
function add_shadow(el){
    el.classList.add('z-depth-5')
    //$(el).children()[2].style.display = "inherit"
    $(el).children()[2].style.visibility = "visible"
}
function rem_shadow(el){
    el.classList.remove('z-depth-5')
    //$(el).children()[2].style.display = "none"
    $(el).children()[2].style.visibility = "hidden"
}
function runMobileScript(){
    console.log("Mobile Detected")
    var els  = document.getElementsByClassName("card_content")
    for(i=0; i < els.length; i+=1){
        els[i].onmouseenter = null
        els[i].onmouseleave = null
    }
    var els  = document.getElementsByClassName("description")
    for(i=0; i < els.length; i+=1) els[i].classList.add('flow-text')
    var els  = document.getElementsByClassName("skillset")
    for(i=0; i < els.length; i+=1) els[i].classList.add('flow-text')
    
}
$("#content a[href^='http']").attr("target","_blank");
$(document).ready(function(){
    var jump = document.getElementById('landing_script').getAttribute("data-jump")
    if(jump) document.getElementById(jump).scrollIntoView();
    if(jump) document.getElementById(jump).click();
    isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())
    console.log(isMobile)
    if (isMobile) runMobileScript();
});