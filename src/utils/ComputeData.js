/**
 *
 * @param {*} metadata_array array of all the analyzed NFT metadata (at function call).
 * @param {*} collection_size number of items currently analyzed
 * @returns
 *
 *
 *
 */
export function ComputeCollectionData(metadata_array, collection_size) {
  //Sometimes collection have NFTs without attributes. To avoid errors, we
  //filter them out of our metadata array
  metadata_array = metadata_array.filter(
    (entry) => entry.attributes !== undefined
  );
  let rarity_data = calc_collection_rarity(metadata_array, collection_size);
  calc_mint_rarity(metadata_array, rarity_data,collection_size);
  
  //Sorting our NFT array, so that each object is ordered by ascending score.
  //The higher the score, the rarer our NFT
  order_by_rank(metadata_array);
  return { rarity_data: rarity_data, nftDataArray: metadata_array };
}

function order_by_rank(metadata_array){
  metadata_array.sort((a, b) => b.rarity_score - a.rarity_score);
  metadata_array.forEach((object, index) => {
    object["rank"]=index+1;
  });
}

/**
 *
 * @param {*} metadata_array array of all the analyzed NFT metadata.
 * @param {*} rarity_data rarity statistics of the analyzed collection
 *
 * Used to compute the total rarity of an NFT, based on its own traits and the traits available in the collection.
 */
export function calc_mint_rarity(metadata_array, rarity_data,collection_size) {
  metadata_array.forEach((object, index) => {
    let rarity_score = 0;
    object.attributes.forEach((attribute) => {
      let type = rarity_data.traits_types.find(
        (o) => o.name === attribute.trait_type
      );
      let value = type.values.find((o) => o.name === attribute.value);
      rarity_score += 100/(+value.absoluteRate);

    });
    object["rarity_score"] = rarity_score;
  });
}

/**
 *
 * @param {*} metadata_array
 * @param {*} collection_size
 * @returns statistics of trait types and their values
 */
export function calc_collection_rarity(metadata_array, collection_size) {
  var propertyToTrait = {
    traits_types: [],
  };

  metadata_array.forEach((object) => {
    object.attributes.forEach((attribute) => {
      //Start by "flattening" traits types and values for an easier further display
      object[attribute.trait_type] = attribute.value;

      //if trait_type exists => increment number of occurences of the type
      let type = propertyToTrait.traits_types.find(
        (o) => o.name === attribute.trait_type
      );
      if (type !== undefined) {
        type.count++;
        //if trait_type associated value exists => increment it / otherwise create it in the data
        let value = type.values.find((o) => o.name === attribute.value);
        if (value !== undefined) {
          value.count++;
        } else {
          type.values.push({ name: attribute.value, count: 1 });
        }
        //if trait_type doesnt exist => create it and its value
      } else {
        propertyToTrait.traits_types.push({
          name: attribute.trait_type,
          values: [{ name: attribute.value, count: 1 }],
          count: 1,
        });
      }
    });
  });

  //For each property, we want to calculate the rate of each trait
  propertyToTrait.traits_types.forEach((property) => {
    //propertyRate represents the rate of belonging of a certain property (eg. hair, necklace...)
    property["propertyRate"] = (property["count"] / collection_size) * 100;
    property["values"].forEach((value) => {
      //Relative to the trait type (eg. 10% of people with hair have red hair)
      value["relativeRate"] = (value["count"] / property["count"]) * 100;
      //Relative to the entire collection (i.e. 10% of haired people have red hair, 10% of people have hair -> 1% of ppl have red hair)
      value["absoluteRate"] =
        ((value["count"] / collection_size))*100;
    });
  });
  return propertyToTrait;
}
