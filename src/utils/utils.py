def image_store(dir_name:str,file_name:str, mode_of_opening,file):
  try:
    with open(f"{dir_name}/{file_name}", mode_of_opening) as buffer:
      buffer.write(file.file.read())
    return True
  except Exception as e:
    return False
  
  
