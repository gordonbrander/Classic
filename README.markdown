# Classic: obvious inheritance for JavaScript

Classic gives you three types of inheritance:

* **Classical inheritance** through prototype chaining
* **Multiple inheritance** through object composition
* **Prototypal inheritance** through a cross-browser polyfill for [Object.prototype.create](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create)

And, it's just about 1/2 of a Kb, minified and gzipped.  
Yup, you read that right: one *half* of a Kb.

## Example

Check it out -- define a class (constructor function):

    var Bunny = classic({
      hop: function (length) { ... }
    });

...and inherit from it:

    var JackRabbit = classic(Bunny, {
      constructor: function (type) {
        this.type = type;
      },
      skip: function (length) { ... }
    });

All prototype properties of Bunny are available to JackRabbit:

    var myJackRabbit = new Jackrabbit('grey');
    myJackRabbit.hop();
    myJackRabbit.skip();

Multiple inheritance is also supported. Pass in any number of
objects to be mixed in with the prototype:

    var artist = { ... };
    var musician = { ... };
    var writer = { ... };
    var Composer = classic(artist, musician, writer);
    
    var myComposer = new Composer();

Mix in objects are merged and the last mentioned property wins,
as you might expect.

Want to do both? Go for it. The first property may optionally be a
function, followed by any number of objects.

    var BrownBear = classic(Animal, bear, best);

Furthermore, you can do direct prototypal inheritance using `classic.create`:

    var animal = { ... };
    // Create a new animal, using animal object as the prototype.
    var cheetah = classic.create(animal);
    cheetah.run = function () { ... };

## What's so great about Classic?

* **Tiny**: you should save code weight with inheritance, not increase it.
* **Obvious**: breaks down JavaScript inheritance into easy-to-understand steps.
* **Useful**: exposes the useful bits of machinery, making it easier to work with objects and inheritance.
* **Efficient**: uses prototypal inheritance and prototype chaining, leaves default objects alone. No black magic here.
* **JavaScript Objects are awesome!**: Jeremy Ashenkas got it right with his [classes-from-object-literals proposal](https://gist.github.com/1329619). While we're waiting for the standards committee to figure things out, let's imitate what makes sense.

## Freebies

In addition to classic, you get a couple of free functions that are useful for working with objects:

`classic.merge`: merge any number of objects together:

    var jazz = { genre: "jazz", composer: "Coltrain", duration: 103 };
    var easyListening = { genre: "muzak", composer: "Some guy" };

    classic.merge(jazz, easyListening, { composer: "Kenny G" });

Gives you:

    { genre: "muzak", duration: 103, composer: "Kenny G"}

`classic.merge` gives you a nice way to define static properties, too:

    var Duck = classic(Bird, { ... });
    classic.merge(Duck, {
       beakType: 'bill',
       footType: 'webbed'
    });

`classic.create`: create a prototype chain between two objects. Delegates to [Object.prototype.create](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create), if supported.