var classic = require('../classic.node.js').classic;

describe('classic', function () {
  var Animal, Bunny, Jackrabbit,
      animal, bunny, jackrabbit;
  
  Animal = classic({
    run: function () { }
  });
  
  Bunny = classic(Animal, {
    constructor: function (color) {
      this.color = color;
    },
    hop: function () { }
  });
  
  Jackrabbit = classic(Bunny, {
    skip: function () { }
  });
  
  beforeEach(function () {
    animal = new Animal();
    bunny = new Bunny();
    jackrabbit = new Jackrabbit();
  });
  
  it('is a function', function () {
    expect(typeof classic).toBe('function');
  });
  
  it('returns a constructor function', function () {
    expect(typeof Animal).toBe('function');
    expect(animal instanceof Animal).toBeTruthy();
  });
  
  it('will create an empty constructor if one is not provided',
  function() {
    expect(typeof Animal.prototype.constructor).toBe('function');
  });
  
  it('will not obscure constructor if one is provided',
  function() {
    expect(typeof Animal.prototype.constructor).toBe('function');
  });
  
  it('constructed objects have the fully-formed constructor function assigned to the constructor property of their prototype',
  function () {
    expect(typeof bunny.constructor).toBe('function');
    expect(bunny.constructor.prototype).toBe(Bunny.prototype);
  });
  
  it('constructs objects that inherit properties from ancestors', 
  function () {
    expect(typeof bunny.run).toBe('function');
    expect(typeof jackrabbit.hop).toBe('function');
    expect(typeof jackrabbit.run).toBe('function');
  });
  
  it('properties inherited from a constructor function do so by prototype bridge rather than object copy.', 
  function () {
    expect(Jackrabbit.prototype instanceof Bunny).toBeTruthy();
    expect(jackrabbit.hasOwnProperty('run')).toBeFalsy();
    expect(jackrabbit.hasOwnProperty('hop')).toBeFalsy();
  });
  
  it('constructor functions can be created by mixing multiple objects', function () {
    var musician = { play: function () {} };
    var person = { think: function () {} };
    
    var Composer = classic(person, musician);
  });
  
  it('will call the parent\'s constructor if one is not supplied',
  function() {
    // TODO
  });
});