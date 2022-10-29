export const search = (arrayOfObjects, searchPaths, query, primaryKey, maxLimit = false, returnParams = false) => {
  var searchResults =
    query && query.toString().trim()
      ? searchObjectsByRelevance(query, arrayOfObjects, searchPaths, primaryKey)
      : arrayOfObjects;

  var returnParamsApply = Array.isArray(returnParams);
  searchResults.forEach((result, index) => {
    Object.keys(result).forEach(keyInResult => {
      if (returnParamsApply && !returnParams.includes(keyInResult)) {
        searchResults[index][keyInResult] = undefined;
      }
    });
  });

  if (!maxLimit || maxLimit > searchResults.length) maxLimit = searchResults.length;
  return searchResults.slice(0, maxLimit);
};

const findAllValuesAtPath = (path, obj, matchesSoFar = []) => {
  if (!Array.isArray(path)) path = path.split('/');
  if (!path.length) return [...matchesSoFar, obj];
  let firstPathComponent = path[0];
  let remainingPath = path.slice(1);
  let multipleMatches = firstPathComponent.endsWith('[]');
  if (multipleMatches) firstPathComponent = firstPathComponent.slice(0, -2).trim();
  let matchingValueAtPath = obj[firstPathComponent];
  if (!matchingValueAtPath) return matchesSoFar;
  if (multipleMatches && !Array.isArray(matchingValueAtPath)) return matchesSoFar;
  let matchesThisRun = [];
  if (multipleMatches) {
    for (var nestedObj of matchingValueAtPath) {
      matchesThisRun.push(...findAllValuesAtPath(remainingPath, nestedObj));
    }
  } else {
    matchesThisRun.push(...findAllValuesAtPath(remainingPath, matchingValueAtPath));
  }
  return [...matchesSoFar, ...matchesThisRun];
};

const searchObjectsByRelevance = (keyword, allObjects, searchPaths, primaryKey) => {
  if (keyword.length < 1) return [];
  var results = [];
  for (var i = 0; i < allObjects.length; i++) {
    // iterate through dataset
    for (var u = 0; u < searchPaths.length; u++) {
      // iterate through each key in dataset
      let allValuesAtPath = findAllValuesAtPath(searchPaths[u], allObjects[i]);
      let allRelevances = allValuesAtPath
        .map(valueAtPath => getRelevance(valueAtPath, keyword))
        .sort((rel1, rel2) => rel2 - rel1);
      if (allRelevances.every(rel => rel == 0)) continue;
      results.push({ relevance: allRelevances[0], entry: allObjects[i] }); // matches found, add to results and store relevance
    }
  }
  results.sort(compareRelevance); // sort by relevance
  for (i = 0; i < results.length; i++) {
    results[i] = results[i].entry; // remove relevance since it is no longer needed
  }
  return filterUniqueIdObjects(results, primaryKey);
};

const filterUniqueIdObjects = (results, primaryKey) => {
  var filteredResults = [];
  for (var result of results) {
    var resultPk = result[primaryKey];
    var pkAlreadyExists = filteredResults.findIndex(r => r[primaryKey] == resultPk) != -1;
    if (!pkAlreadyExists) filteredResults.push(result);
  }
  return filteredResults;
};

const getRelevance = (value, keyword) => {
  if (!value || !keyword) return 0;
  value = value.toString().toLowerCase(); // lowercase to make search not case sensitive
  keyword = keyword.toString().toLowerCase();

  var index = value.indexOf(keyword); // index of the keyword
  var word_index = value.indexOf(' ' + keyword); // index of the keyword if it is not on the first index, but a word

  if (index == 0)
    // value starts with keyword (eg. for 'Dani California' -> searched 'Dan')
    return 3;
  // highest relevance
  else if (word_index != -1)
    // value doesnt start with keyword, but has the same word somewhere else (eg. 'Dani California' -> searched 'Cali')
    return 2;
  // medium relevance
  else if (index != -1)
    // value contains keyword somewhere (eg. 'Dani California' -> searched 'forn')
    return 1;
  // low relevance
  else return 0; // no matches, no relevance
};

const compareRelevance = (a, b) => b.relevance - a.relevance;
