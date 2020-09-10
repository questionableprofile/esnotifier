/* 
A huge thank you to https://github.com/intesso/decode-html
but im a lazyass and i will make a dependency later
*/

let entities = {
    'amp': '&',
    'apos': '\'',
    'lt': '<',
    'gt': '>',
    'quot': '"',
    'nbsp': '\xa0'
  };
  let entityPattern = /&([a-z]+);/ig;
  
  export default function decodeHTMLEntities (text) {
    return text.replace(entityPattern, function(match, entity) {
      entity = entity.toLowerCase();
      if (entities.hasOwnProperty(entity)) {
        return entities[entity];
      }
      return match;
    });
  };
  