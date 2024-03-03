import supabase from "./supabase";

export async function getGuest(param) {
  const { data, error } = await supabase
    .from("guests")
    .select("id, nationalID, fullName, nationality, email")
    .or(`email.eq.${param},nationalID.eq.${param}`)
    .single();

  //excluding code PGRST116 = 0 records were found
  if (error && error.code !== "PGRST116") {
    console.error(error.code);
    throw new Error("Guest information cannot be found");
  }

  return data;
}

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([{ ...newGuest }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("A new guest can not be created");
  }
  return data;
}
