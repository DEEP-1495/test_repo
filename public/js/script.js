const socket = io();

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Deep sinha"
}).addTo(map);

const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("My position:", latitude, longitude);
        socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
        console.error("Geolocation error:", error.code, error.message);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log("Received position:", data);
    
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
        markers[id].bindPopup(`User ${id}`).openPopup();
    }
    
    // Only center the map on our own location
    if (id === socket.id) {
        map.setView([latitude, longitude], 16);
    }
});

socket.on("user-disconnected", (userId) => {
    if (markers[userId]) {
        map.removeLayer(markers[userId]);
        delete markers[userId];
    }
});