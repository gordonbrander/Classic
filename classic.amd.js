define(function () {

// Fast slice lookup.
var slice = Array.prototype.slice;

// Merge any number of objects together, using shallow copy for efficiency.
// The first object is modified in place (doesn't return a new object).
// The last mentioned object property wins.
// 
// Serves the same purpose as jQuery.extend or _.extend.
var merge = function (obj) {
  var objects = slice.call(arguments, 1),
      key, i, l, objN, val;

  for (i=0, l=objects.length; i < l; i++) {
    objN = objects[i];
    for (key in objN) {
      obj[key] = objN[key];
    }
  }

  return obj;
};

// Create a new object, using the provided object as its prototype
// (prototypal inheritance). Delegates to native Object.create
// if supported.
var create = function (obj) {
  var nativeCreate = Object.create;
  if (nativeCreate) return nativeCreate(obj);
  function Ctor() {}
  Ctor.prototype = obj;
  return new Ctor();
};

// Minimal classical inheritance from object literals.  
// Inspired by jashkenas' Proposal: <https://gist.github.com/1329619>.
// 
// Properties of passed objects will be attached to the prototype of your
// new function.
//
// **Classical inheritance**: if the first argument is another constructor 
// function, a prototype chain will be created between it and the resulting
// child function. This gives you classical inheritance via efficient 
// prototype chaining, without emulating `super` or `static`.
// 
// Check it out -- define a base class:
//
//     var Bunny = classic({
//       hop: function (length) { ... }
//     });
// 
// ...and inherit from it:
//
//     var JackRabbit = classic(Bunny, {
//       constructor: function (type) {
//         this.type = type;
//       },
//       skip: function (length) { ... }
//     });
//
// All prototype properties of Bunny are available to JackRabbit:
//
//     var myJackRabbit = new Jackrabbit('grey');
//     myJackRabbit.hop();
//     myJackRabbit.skip();
//
// Multiple inheritance is also supported. Pass in any number of
// objects to be mixed in with the prototype:
// 
//     var artist = { ... };
//     var musician = { ... };
//     var writer = { ... };
//     var Composer = classic(artist, musician, writer);
//     
//     var myComposer = new Composer();
// 
// Mix in objects are merged. and the last mentioned property wins,
// as you might expect.
//
// Want to do both? Go for it. The first property may optionally be a
// function, followed by any number of objects.
//
//     var BrownBear = classic(Animal, bear, best);
var classic = function (Parent) {
  var // If the first param is a function, consider it the parent function.
      // Cache this test, since we use it more than once.
      hasParent = ('function' === typeof Parent),
      // Get the "rest" of the arguments as an array of objects.
      // If the first parameter is a parent function, exclude it from
      // the array -- we treat parent funcs differently.
      rest = slice.call(arguments, (hasParent ? 1 : 0)),
      // Create a new object for our prototype.
      // If a parent function has been provided, construct an object
      // using it's prototype as the proototype for our new object.
      // Otherwise, use an ordinary object.
      proto = hasParent ? create(Parent.prototype) : {},
      Child;
  
  // Merge all "rest" objects into our newly created object.
  merge.apply(null, [proto].concat(rest));

  // Get constructor function from:
  // 
  // * `constructor` property of merged proto object, if present.
  //   (Limitation: must be an "own" property, since all objects
  //   have "Object" as a constructor property on their prototype).
  // * OR patch in the parent constructor if a parent has been provided
  // * OR use an empty function if no parent is assigned.
  Child = (
    proto.hasOwnProperty('constructor') ?
      proto.constructor :
      (
        hasParent ?
          function () {
            return Parent.apply(this, arguments);
          } :
          function () {}
      )
  );
  
  // Now that we have a constructor function, assign our prototype object
  // to it.
  // 
  // After assignment, set the fully finished constructor function (with
  // prototype) as the constructor property of the prototype.
  // Putting a constructor property on the prototype will
  // guaranteed you have one, even if the browser does not set it during
  // construction (**cough, IE, cough**).
  (Child.prototype = proto).constructor = Child;
  return Child;
};

// Expose these handy helper methods.
classic.create = create;
classic.merge = merge;

return classic;
});