/**
 * Middleware de validação de entrada.
 * Factory function: retorna middlewares Express a partir das funções de validação.
 *
 * Uso:
 *   router.post('/', validate(validateCreateBet, 'body'), betsController.create);
 */

const { errors } = require('../utils/apiResponse');

/**
 * @param {Function} validatorFn - Função de validação (retorna {valid, message, parsed})
 * @param {'body'|'query'|'params'} source - De onde vêm os dados
 */
function validate(validatorFn, source = 'body') {
  return (req, res, next) => {
    const result = validatorFn(req[source]);

    if (!result.valid) {
      return errors.badRequest(res, result.message, 'Validation Error');
    }

    // Disponibiliza dados parsed (com tipos corretos) para o controller
    if (result.parsed) {
      req.validated = result.parsed;
    }

    return next();
  };
}

module.exports = { validate };
