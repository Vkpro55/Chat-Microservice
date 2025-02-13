# Chat App Microservice

In modern chat applications, real-time communication comes with challenges such as message loss, inconsistent delivery, scalability issues, and notification delays. Traditional monolithic architectures often struggle with high concurrency, fault tolerance, and seamless user experience across multiple devices.

Instead of just building a simple chat application, we engineered a scalable microservices-based solution that ensures:

- Reliable messaging using event-driven architecture and message queues.
- Scalability through independent microservices for users, chats, and notifications.
- Idempotent operations to prevent duplicate messages and inconsistencies.
- Concurrency management to handle race conditions in real-time messaging.

By implementing microservices with Docker and Nginx with AWS cloud, we ensure a fault-tolerant, efficient, and highly available chat platform that delivers a seamless user experience.

## Table of Contents

- [System Architecture](#system-design--flight-booking-microservices-architecture)
- [Key Engineering Problems](#engineering-challenges-addressed)
- [API Design](#api-design)
- [Tech Stacks](#tech-stacks-with-justification)
- [Features](#features)
- [Services](#overview-of-all-services-in-the-chat-microservices-architecture)

## System Design – Chat Microservice Architecture

![System Design ](/images/hld.png)

## Engineering Challenges Addressed

This project tackles three key engineering challenges:

**Problem 01: Real-Time Message Delivery**

`Problem`: Long polling

- Uses an event-driven architecture but requires a new TCP connection for each request.
- Establishing a new connection involves a 2-way handshake, consuming CPU and RAM.
- Repeatedly reloading resources increases network overhead.

`Solution`: WebSockets

- Maintains a persistent TCP connection, reducing handshake overhead.
- Allows multiple bidirectional messages over the same connection, improving efficiency.

`Problem`: WebSockets alone lack message acknowledgment & reconnection handling

- If a connection drops, there is no built-in recovery mechanism.
- No native support for guaranteed message delivery.

`Solution`: Socket.io

- Handles automatic reconnection when the connection is lost.
- Implements ACK mechanisms ensuring message delivery.
- Provides event-based communication, making real-time updates seamless.

**Problem 02: Preventing Server Overload**

`Problem`: Direct client-to-server communication causes failure & security risks

- If millions of users hit a single server, it overloads and crashes.
- Directly exposing internal services increases security vulnerabilities.

`Solution`: Nginx as a Reverse Proxy

- Distributes incoming traffic across multiple servers, preventing overload.
- Hides internal services from direct public access, improving security.
- Enables failover mechanisms, ensuring high availability.

**Problem 03: Scalability of Database with Growing Users**

`Problem`: Traditional databases struggle with scaling as user data grows

- A single database instance becomes a bottleneck under heavy read/write operations.
- Storing all data in one place limits performance and increases latency.
- Cause single point of failure.

`Solution`: Sharding & Load Balancing for Horizontal Scaling

- Sharding: Splits the database into multiple smaller shards, each handling a portion of the data.
- Load Balancer: Routes queries to the correct shard, optimizing performance.
- Enables parallel processing, reducing query time and ensuring smooth scaling.

## API Design

**User Authentication APIs** `(/api/user)`

Handles user authentication, registration, and login.

- `POST /register` → Registers a new user.

  Request Body:

  ```
  {
    "username": "JohnDoe",
    "email": "john@example.com",
    "password": "securePass123"
  }
  ```

  Response:

  ```
  {
    "message": "User registered successfully",
    "user": {...}
  }
  ```

- `POST /login` → Authenticates user and returns JWT.
  Request Body:

  ```
  {
    "email": "john@example.com",
    "password": "securePass123"
  }
  ```

  Response:

  ```
  {
    "token": "jwt_token",
    "user": {...}
  }
  ```

**Message APIs** `(/api/messages)`

Handles sending, retrieving, and managing chat messages.

- `POST /send` → Sends a message to a specific user.
  Auth Required: ✅ (JWT Authentication)

  Request Body:

  ```
  {
    "receiverId": "socketId",
    "message": "Hello there!"
  }
  ```

  Response:

  ```
  {
    "status": "success",
    "message": "Message sent successfully"
  }
  ```

- `GET /get/`:receiverId → Fetches conversation history with a specific user.
  Auth Required: ✅
  URL Params: receiverId (User’s ID)

  Response:

  ```
  { "conversation": [{ "sender": "JohnDoe", "message": "Hey!" }] }
  ```

## Tech Stacks with Justification

**MongoDB** → `Flexible & Scalable NoSQL Database`

- Document-based storage → Ideal for chat messages with nested structures (users, messages, timestamps).
- Sharding support → Enables horizontal scaling, distributing data across multiple servers as user base grows.
- Schema flexibility → Allows rapid iterations in a dynamic chat system without strict table structures.

**RabbitMQ** → `Asynchronous Message Queue for Decoupled Microservices`

- Efficient message brokering → Prevents blocking and ensures chat messages & notifications are processed asynchronously.
- Load distribution → Manages high throughput by queueing and distributing tasks efficiently.
- Reliable delivery → Ensures messages are not lost even if services temporarily fail.

**FCM (Firebase Cloud Messaging)** → `Push Notifications for Web`

- Real-time notifications → Keeps users informed about new messages even when the app is closed.
- Low power consumption → Efficient push mechanism for mobile devices.
- Cross-platform support → Works seamlessly on Android, iOS, and web applications.

**Nodemailer** → `Email Notification Service`

- SMTP-based email delivery → Used to send emails for offline message notifications.
- Reliable & Customizable → Supports attachments, HTML templates, and email tracking.
- Ensures message delivery → Helps notify users who are not online, ensuring engagement.

**JWT (JSON Web Token)** → `Secure & Stateless Authentication`

- Compact & Efficient → Used for user authentication without requiring database lookups.
- Prevents session hijacking → Signed tokens ensure tamper-proof authentication.
- Scalable → Works well in distributed systems where storing session state is not feasible.

**Node.js** → `Scalable Backend for Real-Time Applications`

- Event-driven, Non-blocking I/O → Handles multiple concurrent connections efficiently.
- Optimized for WebSockets → Perfect for handling real-time chat and messaging.
- Lightweight & Fast → Uses a single-threaded event loop, reducing overhead.

**Express.js** →` Minimalist Web Framework for API Development`

- Simplifies request handling → Provides middleware for authentication, routing, and response formatting.
- High-performance → Lightweight framework that complements Node.js for fast API responses.
- Extensible → Easily integrates with third-party services like RabbitMQ and MongoDB.

**Nginx** → `Reverse Proxy & Load Balancer`

- Distributes load → Ensures no single backend server is overwhelmed.
- Enhances security → Prevents direct exposure of internal services to the public.
- Improves performance → Caches static content, reducing request overhead.

**Socket.io** → `WebSockets for Real-Time Communication`

- Persistent connection → Unlike long polling, it keeps a single TCP connection open.
- Bi-directional messaging → Enables instant communication between client & server.
- Automatic fallback → Switches to polling if WebSockets are blocked by a firewall.

## Features

**Real-Time Messaging**

- Instant bidirectional communication between users using WebSockets (Socket.io).
- Supports one-to-one and group chats.

**Message Persistence & Storage**

- Uses MongoDB to store chat history efficiently.
- Messages are indexed for fast retrieval and search.

**User Authentication & Authorization**

- JWT-based authentication for secure login and access control.

**Push Notifications**

- FCM (Firebase Cloud Messaging) for real-time notifications when users receive messages but are offline.

**Message Queuing for Scalability**

- RabbitMQ ensures messages are asynchronously processed to prevent overload.
- Used for background tasks like notifications, analytics, and logging.

**Offline Message Storage & Sync**

- Messages sent while a user is offline are stored and delivered when they reconnect.
- Chat history is synced across multiple devices.

S**calability & Load Balancing**

- Nginx as a reverse proxy to distribute traffic across multiple servers.
- Database sharding to handle large volumes of messages.

## Overview of All Services in the Chat Microservices Architecture

**User Service**

The User Service is responsible for handling all user-related operations, including:

- User Registration & Authentication: Uses JWT for secure login.
- User Profile Management: Stores user details in MongoDB.
- Password Hashing & Security: Uses bcrypt for encryption.
- Friendship & Contacts Management: Handles friend requests and contact lists.
- Session Management: Keeps track of active users for better chat experience.

**Chat Service**

The Chat Service enables real-time communication between users:

- Real-Time Messaging: Uses Socket.io & WebSockets for instant updates.
- Message Storage & Retrieval: Saves messages in MongoDB for quick access.
- Read Receipts & Message Status: Tracks sent, delivered, and read messages.
- Group Chat Support: Manages multiple participants in one conversation.
- Media & File Sharing: Allows users to send images, videos, and documents.

**Notification Service**

The Notification Service ensures users receive timely updates:

- Push Notifications: Uses FCM (Firebase Cloud Messaging) for mobile alerts.
- In-App Alerts: Displays chat notifications within the web app.
- Email Notifications: Sends updates via Nodemailer when users are offline.
- Event-Based System: Uses RabbitMQ to process notifications asynchronously.
