define(function () {
  // Fast slice lookup.
  var slice = Array.prototype.slice;
  
  // Merge any number of objects together.
  // The first object has it's reference modified
  // (doesn't return a new object).
  // The last object property wins.
  // 
  // Serves the same purpose as jQuery.extend and _.extend.
  var merge = function (obj) {
    var objects = slice.call(arguments, 1),
        key, i, l, objN;

    for (i=0, l=objects.length; i < l; i++) {
      objN = objects[i];
      for (key in objN) {
        // Don't copy built-in or inherited object properties.
        if (!objN.hasOwnProperty(key)) continue;
        obj[key] = objN[key];
      }
    }

    return obj;
  };
  
  // Use a provided object as the prototype for
  // another object.
  // Delegates to Object.create, if supported.
  var create = Object.create || function (obj) {
    function Ctor() {}
    Ctor.prototype = obj;
    return new Ctor();
  };

  // Minimal classical inheritance via object literals.  
  // Inspired by jashkenas' Proposal: <https://gist.github.com/1329619>.
  // 
  // Creates constructor functions from objects.
  // All "own" properties of the passed objects will be copied to the 
  // prototype. If the first argument is another constructor function, a 
  // prototype bridge will be created between the constructor function
  // provided and the resulting child constructor function.
  // This gives you classical inheritance via efficient prototype chaining,
  // without emulating `super` or `static`.
  // 
  // Check it out:
  //
  //     var Bunny = classic({
  //       hop: function (length) { ... }
  //     });
  //     
  //     var JackRabbit = classic(Bunny, {
  //       constructor: function (type) {
  //         this.type = type;
  //       },
  //       skip: function (length) { ... }
  //     });
  //     
  //     var myJackRabbit = new Jackrabbit('grey');
  //     myJackRabbit.hop();
  //     myJackRabbit.skip();
  //
  // Also supported: multiple inheritance via any number of object mixins:
  // 
  //     var person = { ... };
  //     var musician = { ... };
  //     var writer = { ... };
  //     var Composer = classic(person, musician, writer);
  //     
  //     var myComposer = new Composer();
  // 
  // When more than one object is passed in, the objects are merged
  // The last mentioned property wins, as you might expect.
  //
  // Want to do both? Go for it. The first property can be a constructor
  // function, with any number of objects passed in after.
  //
  //     var BrownBear = classic(Animal, bear, best);
  var classic = function (Parent) {
    // If the first param is a function, consider it the parent "class".
    // Cache this test, since we use it more than once.
    var hasParent = ('function' === typeof Parent),
        // Determine where to slice the arguments. If the first
        // argument is a constructor function,
        // we want to slice at `1`, so it is not included in the object merge.
        // If the first argument is not a function, assume it is an object
        // and include it in the object merge.
        at = (hasParent ? 1 : 0),
        rest = slice.call(arguments, at),
        obj, Child, __Child;
    
    // If we've got more than one object, merge all "rest" objects into a 
    // single object, creating a shallow copy so we don't accidentally modify
    // objects passed in.
    obj = (rest.length > 1) ? merge.apply(null, [{}].concat(rest)) : rest[0];
    
    // Create constructor using:
    // 
    // * `constructor` property of object, if set
    // * OR patch in parent constructor if a parent has been passed in
    // * OR use an empty function if no parent is assigned.
    Child = (
      obj.hasOwnProperty('constructor') ?
        obj.constructor :
        (
          hasParent ?
            function () {
              return Parent.apply(this, arguments);
            } :
            function () {}
        )
    );
    
    // Make a prototype bridge between child and parent.
    if (hasParent) Child.prototype = create(Parent.prototype);

    // Merge properties from our object literal into the prototype of our
    // constructor. Properties in our object will obscure properties inherited
    // from the `Parent` prototype.
    //
    // After merging, set the fully finished constructor function (with
    // prototype) as the constructor property of the prototype.
    // Putting a constructor property on the prototype will
    // guaranteed you have one, even if the browser does not set it during
    // construction (**cough, IE, cough**).
    merge(Child.prototype, obj).constructor = Child;
    return Child;
  };
  
  // Expose these handy helper methods.
  classic.create = create;
  classic.merge = merge;
  
  return classic;
});