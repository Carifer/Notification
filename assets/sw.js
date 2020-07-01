'use strict';

// -- ENVIO DE LA NOTIFICACION -- //

self.addEventListener('push', function(e){
    const message = e.data.json(); //1

    const options = { //2
        body : message.body,
        data: 'http://localhost:4444',
        actions: [
            {
                action: 'Detail',
                title: 'Detalles'
            }
        ]

    };
    try {
        const notificationPromise = self.registration.showNotification(message.title, options);
        e.waitUntil(notificationPromise);
    } catch (error) {
        console.log(error);
    }
    // 3
});

// -- LISTENER CLICK EN LA NOTIFICACION --//

self.addEventListener('notificationclick', function(e){
    console.log('Notification click Received.', e.notification.data);

    e.notification.close(); // 1
    e.waitUntil(clients.openWindow(e.notification.data)); // 2
});

