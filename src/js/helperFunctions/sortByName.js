export default function sortByName(data, sortBy, order) {
  data.sort((a, b) => {
    if (a.name[sortBy] < b.name[sortBy]) {
      if (order === 'asc')
        return 1;
      return -1;
    } else {
      if (order === 'asc')
        return -1;
      return 1;
    }
  })
}