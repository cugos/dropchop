function addEventHandlers() {


  /* + + + + + DROPZONE + + + + +
  */
  var dropzone = window;
  dropzone.addEventListener('dragover', function(e) {
    e = e || event;
    e.preventDefault();
    document.body.className = "dragging";
  }, false);
  dropzone.addEventListener('dragleave', function(e) {
    e = e || event;
    e.preventDefault();
    document.body.className = "";
  }, false);
  dropzone.addEventListener('drop', function(e) {
    e = e || event;
    e.preventDefault();
    document.body.className = "";
    files = e.dataTransfer.files;
    handleFiles(files);
  }, false);


  /* + + + + + OPERATIONS + + + + +
  */
  var buffer = document.getElementById('buffer');
  buffer.addEventListener('click', function(){
    // ops.geom.buffer(object, info);
    ops.execute(ops.geom.buffer(selection.list[0].layer._geojson, selection.list[0].info));
  });

  var union = document.getElementById('union');
  union.addEventListener('click', function(){
    // ops.geom.union(object1, object2, info1, info2);
    ops.execute(ops.geom.union(selection.list[0].layer._geojson, selection.list[1].layer._geojson, selection.list[0].info, selection.list[1].info));
  });

  var erase = document.getElementById('erase');
  erase.addEventListener('click', function(){
    // ops.geom.union(object1, object2, info1, info2);
    ops.execute(ops.geom.erase(selection.list[0].layer._geojson, selection.list[1].layer._geojson, selection.list[0].info, selection.list[1].info));
  });

  var intersect = document.getElementById('intersect');
  intersect.addEventListener('click', function(){
    // ops.geom.union(object1, object2, info1, info2);
    ops.execute(ops.geom.intersect(selection.list[0].layer._geojson, selection.list[1].layer._geojson, selection.list[0].info, selection.list[1].info));
  });  
  /* + + + + + MENU + + + + +
  */
  var menu = document.getElementsByClassName('menu-expand');
  for (var m = 0; m < menu.length; m++) {
    menu[m].addEventListener('click', menuClick, false);
  }
  function menuClick() {
    var menuExpand = this.nextSibling.nextSibling;
    if (menuExpand.className.indexOf('expanded') == -1) {
      menuExpand.className += ' expanded';
    } else {
      menuExpand.className = 'menu';
    }      
  }
  
}