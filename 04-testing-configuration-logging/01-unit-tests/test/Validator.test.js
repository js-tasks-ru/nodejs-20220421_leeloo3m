const Validator = require('../Validator');
const expect = require('chai').expect;


describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
   
    describe('валидатор проверяет строковые поля', () => {
      const rules = {
        name: {
          type: 'string',
          min: 5, 
          max: 10
        }, 
  
      };
    
      const validator = new Validator(rules);
    
      it('некорректный тип поля', () => {
        const errors = validator.validate({ name: 5 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });

      it('длина строки слишком короткая', () => {
        const errors = validator.validate({ name: 'La' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 2');
      });

      it('длина строки слишком длинная', () => {
        const errors = validator.validate({ name: 'Lalalalalala' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 12');
      });

      it('cтрока пустая', () => {
        const errors = validator.validate({ name: '' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('string can not be empty');
      });
    });

    describe('валидатор проверяет числовые поля', () => {
      const rules = {
      
        age: {
          type: 'number',
          min: 18,
          max: 27
        }
      };
      
      const validator = new Validator(rules);

      it('некорректный тип поля', () => {
        const errors = validator.validate({ age: '5' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      });

      it('число слишком маленькое', () => {
        const errors = validator.validate({ age: 2 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 2');
      });

      it('число слишком большое', () => {
        const errors = validator.validate({ age: 40 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 40');
      });

      it('число явлется отрицательным', () => {
        const errors = validator.validate({ age: -3 });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('can not be negative');
      });
    });
  
  });
});