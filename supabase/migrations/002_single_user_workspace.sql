-- Single-user private workspace support.
-- The application protects access with PRIVATE_ACCESS_TOKEN rather than a visible login.
do $$
begin
  alter table profiles drop constraint if exists profiles_id_fkey;
exception when undefined_object then null;
end $$;

insert into profiles (id, full_name, timezone, base_currency)
values ('00000000-0000-0000-0000-000000000001', 'Mishit Shah', 'Asia/Kolkata', 'USD')
on conflict (id) do update set full_name = excluded.full_name, timezone = excluded.timezone, base_currency = excluded.base_currency;
