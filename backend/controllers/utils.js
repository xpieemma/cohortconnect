export const toggleElement = async (model, id, field, value) => {
 
  const result = await model.updateOne(
    { _id: id },
    { $addToSet: { [field]: value } }
  );

  if (result.modifiedCount === 0) {
    await model.updateOne(
      { _id: id },
      { $pull: { [field]: value } }
    );
    return 'Removed';
  }
  
  return 'Added';
};