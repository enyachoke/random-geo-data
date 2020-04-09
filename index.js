const fs = require('fs');
const casual = require('casual');
const { generateRandomPoints ,generateRandomGeoJsonPoints} = require('./geo');
const initClustersGeoPoints = generateRandomPoints({ 'lat': 0.5198329, 'lng': 35.2715481 }, 40000, 100);
const ages = [1, 10, 12, 20, 30, 40, 50, 60, 90, 15, 16, 34, 25, 45, 65, 83, 86, 70, 75]
const geo_provider = {
    geo_points: function (startPoint, radius, numberOfPoints) {
        return generateRandomGeoJsonPoints(startPoint, radius, numberOfPoints);
    }
};

const array_of = function(times, generator) {
    const result = [];
 
    for (var i = 0; i < times; ++i) {
        result.push(generator());
    }
 
    return result;
};
 
// Will generate array of five random timestamps
const array_of_timestamps = array_of(200, casual._unix_time);

casual.register_provider(geo_provider);
casual.define('person', function (startPoint, radius, numberOfPoints) {
    return {
        age: casual.email,
        uuid: casual.uuid,
        firstname: casual.first_name,
        lastname: casual.last_name,
        phone: casual.phone,
        age: casual.random_element(ages),
        points: casual.geo_points(startPoint, radius, numberOfPoints)
    };
});
const people = [];
for (const point of initClustersGeoPoints) {
    let person = casual.person(point, 10000, 200);
    person.points.map((point)=>{
        point.timestamp = casual.random_element(array_of_timestamps);
        return point;
    });
    people.push(person)
}
fs.writeFileSync('data.json', JSON.stringify(people));
