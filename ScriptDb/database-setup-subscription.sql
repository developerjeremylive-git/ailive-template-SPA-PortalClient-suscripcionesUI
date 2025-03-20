--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (PGlite 0.2.0)
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = off;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET escape_string_warning = off;
SET row_security = off;

--
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: embeddings; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.embeddings (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    embedding public.vector(384) NOT NULL
);


ALTER TABLE meta.embeddings OWNER TO postgres;

--
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.embeddings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.embeddings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: migrations; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migrations (
    version text NOT NULL,
    name text,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migrations OWNER TO postgres;

--
-- Name: activitylogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activitylogs (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    action text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    details text
);


ALTER TABLE public.activitylogs OWNER TO postgres;

--
-- Name: activitylogs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.activitylogs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.activitylogs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    issued_date timestamp with time zone DEFAULT now(),
    due_date timestamp with time zone,
    status text NOT NULL,
    stripe_transaction_id bigint
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.invoices ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    message text NOT NULL,
    sent_at timestamp with time zone DEFAULT now(),
    read boolean DEFAULT false
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: paymentmethods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paymentmethods (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    method_id text NOT NULL,
    method_type text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.paymentmethods OWNER TO postgres;

--
-- Name: paymentmethods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.paymentmethods ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.paymentmethods_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: planchangehistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planchangehistory (
    id bigint NOT NULL,
    subscription_id bigint NOT NULL,
    old_plan_id bigint NOT NULL,
    new_plan_id bigint,
    change_date timestamp with time zone DEFAULT now()
);


ALTER TABLE public.planchangehistory OWNER TO postgres;

--
-- Name: planchangehistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.planchangehistory ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.planchangehistory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plans (
    id bigint NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    features text[]
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- Name: plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.plans ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id bigint NOT NULL,
    plan_id bigint NOT NULL,
    code text NOT NULL,
    discount_percentage numeric(5,2) NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    conditions text
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: promotions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.promotions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.promotions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: refundrequests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refundrequests (
    id bigint NOT NULL,
    subscription_id bigint NOT NULL,
    amount numeric(10,2) NOT NULL,
    reason text,
    status text NOT NULL,
    request_date timestamp with time zone DEFAULT now(),
    processed_date timestamp with time zone
);


ALTER TABLE public.refundrequests OWNER TO postgres;

--
-- Name: refundrequests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.refundrequests ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.refundrequests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stripecustomers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stripecustomers (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    stripe_customer_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.stripecustomers OWNER TO postgres;

--
-- Name: stripecustomers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.stripecustomers ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.stripecustomers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stripetransactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stripetransactions (
    id bigint NOT NULL,
    subscription_id bigint NOT NULL,
    stripe_transaction_id text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    error_message text,
    promotion_id bigint,
    payment_method_id bigint
);


ALTER TABLE public.stripetransactions OWNER TO postgres;

--
-- Name: stripetransactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.stripetransactions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.stripetransactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    plan_id bigint NOT NULL,
    start_date timestamp with time zone DEFAULT now(),
    end_date timestamp with time zone,
    status text NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.subscriptions ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: userpreferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userpreferences (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    notification_settings text,
    theme text,
    language text
);


ALTER TABLE public.userpreferences OWNER TO postgres;

--
-- Name: userpreferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.userpreferences ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.userpreferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: webhookevents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.webhookevents (
    id bigint NOT NULL,
    event_id text NOT NULL,
    event_type text NOT NULL,
    payload jsonb NOT NULL,
    received_at timestamp with time zone DEFAULT now(),
    processed boolean DEFAULT false
);


ALTER TABLE public.webhookevents OWNER TO postgres;

--
-- Name: webhookevents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.webhookevents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.webhookevents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: meta; Owner: postgres
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: meta; Owner: postgres
--

INSERT INTO meta.migrations VALUES ('202407160001', 'embeddings', '2025-03-07 00:51:40.306+00');


--
-- Data for Name: activitylogs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: paymentmethods; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: planchangehistory; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: refundrequests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: stripecustomers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: stripetransactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: userpreferences; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: webhookevents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.embeddings_id_seq', 1, false);


--
-- Name: activitylogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activitylogs_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: paymentmethods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paymentmethods_id_seq', 1, false);


--
-- Name: planchangehistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.planchangehistory_id_seq', 1, false);


--
-- Name: plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plans_id_seq', 1, false);


--
-- Name: promotions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotions_id_seq', 1, false);


--
-- Name: refundrequests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refundrequests_id_seq', 1, false);


--
-- Name: stripecustomers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stripecustomers_id_seq', 1, false);


--
-- Name: stripetransactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stripetransactions_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: userpreferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.userpreferences_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: webhookevents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.webhookevents_id_seq', 1, false);


--
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: activitylogs activitylogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activitylogs
    ADD CONSTRAINT activitylogs_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: paymentmethods paymentmethods_method_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paymentmethods
    ADD CONSTRAINT paymentmethods_method_id_key UNIQUE (method_id);


--
-- Name: paymentmethods paymentmethods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paymentmethods
    ADD CONSTRAINT paymentmethods_pkey PRIMARY KEY (id);


--
-- Name: planchangehistory planchangehistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planchangehistory
    ADD CONSTRAINT planchangehistory_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_code_key UNIQUE (code);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: refundrequests refundrequests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refundrequests
    ADD CONSTRAINT refundrequests_pkey PRIMARY KEY (id);


--
-- Name: stripecustomers stripecustomers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripecustomers
    ADD CONSTRAINT stripecustomers_pkey PRIMARY KEY (id);


--
-- Name: stripecustomers stripecustomers_stripe_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripecustomers
    ADD CONSTRAINT stripecustomers_stripe_customer_id_key UNIQUE (stripe_customer_id);


--
-- Name: stripetransactions stripetransactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripetransactions
    ADD CONSTRAINT stripetransactions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: userpreferences userpreferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userpreferences
    ADD CONSTRAINT userpreferences_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: webhookevents webhookevents_event_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhookevents
    ADD CONSTRAINT webhookevents_event_id_key UNIQUE (event_id);


--
-- Name: webhookevents webhookevents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.webhookevents
    ADD CONSTRAINT webhookevents_pkey PRIMARY KEY (id);


--
-- Name: activitylogs activitylogs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activitylogs
    ADD CONSTRAINT activitylogs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invoices invoices_stripe_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_stripe_transaction_id_fkey FOREIGN KEY (stripe_transaction_id) REFERENCES public.stripetransactions(id);


--
-- Name: invoices invoices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: paymentmethods paymentmethods_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paymentmethods
    ADD CONSTRAINT paymentmethods_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: planchangehistory planchangehistory_new_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planchangehistory
    ADD CONSTRAINT planchangehistory_new_plan_id_fkey FOREIGN KEY (new_plan_id) REFERENCES public.plans(id);


--
-- Name: planchangehistory planchangehistory_old_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planchangehistory
    ADD CONSTRAINT planchangehistory_old_plan_id_fkey FOREIGN KEY (old_plan_id) REFERENCES public.plans(id);


--
-- Name: planchangehistory planchangehistory_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planchangehistory
    ADD CONSTRAINT planchangehistory_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id);


--
-- Name: promotions promotions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id);


--
-- Name: refundrequests refundrequests_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refundrequests
    ADD CONSTRAINT refundrequests_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id);


--
-- Name: stripecustomers stripecustomers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripecustomers
    ADD CONSTRAINT stripecustomers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: stripetransactions stripetransactions_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripetransactions
    ADD CONSTRAINT stripetransactions_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.paymentmethods(id);


--
-- Name: stripetransactions stripetransactions_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripetransactions
    ADD CONSTRAINT stripetransactions_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id);


--
-- Name: stripetransactions stripetransactions_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stripetransactions
    ADD CONSTRAINT stripetransactions_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id);


--
-- Name: subscriptions subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id);


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: userpreferences userpreferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userpreferences
    ADD CONSTRAINT userpreferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

