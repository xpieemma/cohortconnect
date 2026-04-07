export const toggleElement = async (model, id, field, value) => {
  // 1. Try to add the value (prevents duplicates)
  const result = await model.updateOne(
    { _id: id },
    { $addToSet: { [field]: value } }
  );

  // 2. If modifiedCount is 0, the value already existed, so remove it
  if (result.modifiedCount === 0) {
    await [model].updateOne(
      { _id: id },
      { $pull: { [field]: value } }
    );
    return 'Removed';
  }
  
  return 'Added';
}