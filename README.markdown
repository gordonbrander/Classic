# Classic

Tiny Classical Inheritance for JavaScript.

It's just about 1/3 of a Kb, minimized and gzipped. Yup, you read that right: 0.3 Kb.

## Example

Make a constructor function out of an object:

    var Bunny = classic({
      hop: function (length) { ... },
      skip: function (length) { ... }
    });
    
Inherit from another constructor function:

    var JackRabbit = classic(Bunny, {
      constructor: function (color) {
        this.color = color;
      },
      jump: function (length) { ... }
    });
    
Inheritance!
    
    var myJackRabbit = new Jackrabbit('grey');
    
    myJackRabbit.hop();
    myJackRabbit.skip();
    myJackRabbit.jump();

## What's so great about Classic?

* **Tiny**: you should save code weight with inheritance, not increase it.
* **Obvious**: breaks down JavaScript inheritance into easy-to-understand steps.
* **Useful**: exposes the useful bits of machinery, making it easier to work with objects and inheritance.
* **Efficient**: uses prototypal inheritance and prototype chaining, leaves default objects alone. No black magic here.
* **JavaScript Objects are awesome!**: Jeremy Ashenkas got it right with his [classes-from-object-literals proposal](https://gist.github.com/1329619). While we're waiting for the standards committee to figure things out, let's imitate what makes sense.

## How To

Include classic in your page:

    <script src="path/to/classic.js"></script>

Use it:

    <script>
        var Classocolypse = classic({
          ...
        });
        
        var splode = new Classocolypse();
    </script>

It also works with AMD (`classic.amd.js`) and Node (`classic.node.js`).

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

`classic.bridge`: create a prototype chain between two functions.