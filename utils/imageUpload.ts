export const imageValidator = ({ files }: imageValidatorProps): [boolean, string] => {
  const permittedFileExtensions = ['PNG', 'JPG', 'JPEG', 'BMP']


  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExtension = file.name.split('.')[1].toUpperCase()

    if (!file.type.startsWith('image/')) {
      return [false, 'Файл зөвхөн зураг байх ёстой.'];
    }

    if (!permittedFileExtensions.includes(fileExtension)) {
      return [false, 'Зөвшөөрөгдөөгүй зургийн өргөтгөл байна.'];
    }
  }

  return [true, ''];
};

export const createImageURLs = ({ files }: createImageURLsProps) => {
  const imageURLs: previewImage[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    imageURLs.push({src: URL.createObjectURL(file), name: file.name});
  }

  return imageURLs
}

type imageValidatorProps = {
  files: FileList;
};

type createImageURLsProps = {
  files: FileList | File[];
}

export type previewImage = {
  src: string;
  name: string;
}